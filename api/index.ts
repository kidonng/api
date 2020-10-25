import { ky, ServerRequest } from '../deps.ts'

export default async (req: ServerRequest) => {
  const { url, headers } = req
  const searchParams = new URLSearchParams(url.substring(url.indexOf('?')))
  const { name, step = '1', ...params } = Object.fromEntries(
    searchParams.entries()
  )

  if (params.label) {
    const search = new URLSearchParams({
      ...params,
      url: `${headers.get('x-forwarded-proto')}://${headers.get(
        'x-forwarded-host'
      )}/api?name=${name}`,
      query: `$['${name}']`,
    }).toString()

    return req.respond({
      status: 308,
      headers: new Headers({
        location: `https://img.shields.io/badge/dynamic/json?${search}`,
      }),
    })
  }

  const { GH_TOKEN, GIST_ID } = Deno.env.toObject()
  if (!GH_TOKEN || !GIST_ID)
    return req.respond({
      status: 503,
      body: 'Please config `GH_TOKEN` and `GIST_ID` environment variables.',
    })

  if (!name)
    return req.respond({
      status: 400,
      body: 'Please provide `name` parameter.',
    })

  const api = ky.extend({
    prefixUrl: 'https://api.github.com',
    headers: {
      authorization: `token ${GH_TOKEN}`,
    },
  })
  const { files } = await api.get(`gists/${GIST_ID}`).json()
  const [[filename, { content }]] = Object.entries(files)

  let counters

  try {
    counters = JSON.parse(content)
  } catch {
    return req.respond({
      status: 500,
      body: 'Please make sure the first file of the gist is valid JSON.',
    })
  }

  if (typeof counters?.[name] !== 'number')
    return req.respond({
      status: 500,
      body: 'Please make sure the counter is defined and its type is number.',
    })

  counters[name] += Number(step)

  const responseHeaders = new Headers({
    'access-control-allow-origin': '*',
    'content-type': 'application/json; charset=utf-8',
  })
  if (Number(step) === 0) responseHeaders.set('cache-control', 's-maxage=300')
  else
    await api.patch(`gists/${GIST_ID}`, {
      json: {
        files: {
          [filename]: {
            filename: 'counter.json',
            content: JSON.stringify(counters),
          },
        },
      },
    })

  req.respond({
    body: JSON.stringify({ [name]: counters[name] }),
    headers: responseHeaders,
  })
}
