import { GistAPI, GraphQL, ExtendedRequest, ServerRequest } from '../deps.ts'

export default async (req: ServerRequest) => {
  const { headers, search, respond, redirect } = new ExtendedRequest(req)
  const { 'x-forwarded-proto': proto, 'x-forwarded-host': host } = headers
  const { name, step: _step, ...params } = search
  const step = Number(_step) || 1

  if (!name)
    return respond({
      status: 400,
      body: 'Please provide `name` parameter.',
    })

  if (params.label) {
    const apiUrl = new URL(`${proto}://${host}/api`)
    apiUrl.search = new URLSearchParams({ name, step: String(step) }).toString()

    const badgeUrl = new URL('https://img.shields.io/badge/dynamic/json')
    badgeUrl.search = new URLSearchParams({
      ...params,
      url: apiUrl.toString(),
      query: `$['${name}']`,
    }).toString()

    return redirect(badgeUrl.toString())
  }

  const { GH_TOKEN, GIST_ID } = Deno.env.toObject()
  if (!(GH_TOKEN && GIST_ID))
    return respond({
      status: 503,
      body: 'Please config `GH_TOKEN` and `GIST_ID` environment variables.',
    })

  const { update } = new GistAPI(GH_TOKEN)
  const { graphql } = new GraphQL(GH_TOKEN)
  const {
    viewer: {
      gist: {
        files: [{ name: filename, text }],
      },
    },
  } = await graphql(`
    viewer {
      gist(name: "${GIST_ID}") {
        files(limit: 1) {
          name
          text
        }
      }
    }
  `)

  try {
    const counters = JSON.parse(text)

    if (typeof counters?.[name] !== 'number')
      return respond({
        status: 500,
        body: 'Please ensure the counter is defined and its type is number.',
      })

    counters[name] += step

    const responseHeaders = new Headers({
      'access-control-allow-origin': '*',
    })
    if (step === 0) responseHeaders.set('cache-control', 's-maxage=300')
    await respond({
      json: { [name]: counters[name] },
      headers: responseHeaders,
    })

    if (step !== 0)
      await update({
        id: GIST_ID,
        files: {
          [filename]: {
            filename,
            content: JSON.stringify(counters),
          },
        },
      })
  } catch {
    respond({
      status: 500,
      body: 'Please ensure the first file of the gist is valid JSON.',
    })
  }
}
