import { gist, ServerRequest } from '../deps.ts'

export default async (req: ServerRequest) => {
  const { url, headers } = req
  const searchParams = new URLSearchParams(url.substring(url.indexOf('?')))
  const { name, step: _step, ...params } = Object.fromEntries(
    searchParams.entries()
  )
  const step = Number(_step) || 1

  if (!name)
    return req.respond({
      status: 400,
      body: 'Please provide `name` parameter.',
    })

  if (params.label) {
    const apiUrl = new URL(
      `${headers.get('x-forwarded-proto')}://${headers.get(
        'x-forwarded-host'
      )}/api`
    )
    apiUrl.search = new URLSearchParams({ name, step: String(step) }).toString()

    const badgeUrl = new URL('https://img.shields.io/badge/dynamic/json')
    badgeUrl.search = new URLSearchParams({
      ...params,
      url: apiUrl.toString(),
      query: `$['${name}']`,
    }).toString()

    return req.respond({
      status: 308,
      headers: new Headers({
        location: badgeUrl.toString(),
      }),
    })
  }

  const { GH_TOKEN, GIST_ID } = Deno.env.toObject()
  if (!(GH_TOKEN && GIST_ID))
    return req.respond({
      status: 503,
      body: 'Please config `GH_TOKEN` and `GIST_ID` environment variables.',
    })

  const { getGist, updateGist } = gist(GH_TOKEN)
  const { files } = await getGist(GIST_ID)
  const [{ filename, content }] = Object.values(files)

  try {
    const counters = JSON.parse(content)

    if (typeof counters?.[name] !== 'number')
      return req.respond({
        status: 500,
        body: 'Please ensure the counter is defined and its type is number.',
      })

    counters[name] += step

    const responseHeaders = new Headers({
      'access-control-allow-origin': '*',
      'content-type': 'application/json; charset=utf-8',
    })
    if (step === 0) responseHeaders.set('cache-control', 's-maxage=300')
    await req.respond({
      body: JSON.stringify({ [name]: counters[name] }),
      headers: responseHeaders,
    })

    if (step !== 0)
      await updateGist({
        id: GIST_ID,
        files: {
          [filename]: {
            filename,
            content: JSON.stringify(counters),
          },
        },
      })
  } catch {
    req.respond({
      status: 500,
      body: 'Please ensure the first file of the gist is valid JSON.',
    })
  }
}
