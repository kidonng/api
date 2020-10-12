import { Octokit } from '@octokit/rest'
import { NowRequest, NowResponse } from '@vercel/node'

export default async (
  { query: { name, step = '1', ...params }, headers }: NowRequest,
  res: NowResponse
) => {
  if (params.label) {
    const search = new URLSearchParams({
      ...params,
      url: `${headers['x-forwarded-proto']}://${headers.host}/api?name=${name}`,
      query: `$['${name}']`,
    }).toString()

    res.setHeader(
      'Location',
      `https://img.shields.io/badge/dynamic/json?${search}`
    )
    return res.status(308).end()
  }

  const { GH_TOKEN, GIST_ID } = process.env
  if (!GH_TOKEN || !GIST_ID)
    return res
      .status(503)
      .send('Please config `GH_TOKEN` and `GIST_ID` environment variables.')

  if (typeof name !== 'string')
    return res
      .status(400)
      .send('Please provide one and only one `name` parameter.')

  if (typeof step !== 'string')
    return res.status(400).send('Please provide only one `step` parameter.')

  const {
    gists: { get, update },
  } = new Octokit({ auth: GH_TOKEN })
  const {
    data: { files },
  } = await get({ gist_id: GIST_ID })
  const [[filename, { content }]] = Object.entries(files)

  let counters

  try {
    counters = JSON.parse(content!)
  } catch {
    return res
      .status(500)
      .send('Please make sure the first gist file is valid JSON.')
  }

  if (typeof counters?.[name] !== 'number')
    return res.status(500).send('Please define the counter as a number.')

  counters[name] += Number(step)

  if (Number(step) === 0) res.setHeader('Cache-Control', 's-maxage=300')
  else
    await update({
      gist_id: GIST_ID,
      files: {
        [filename]: {
          filename: 'counter.json',
          content: JSON.stringify(counters),
        },
      },
    })

  res.json({ [name]: counters[name] })
}
