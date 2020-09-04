import { Octokit } from '@octokit/rest'
import { NowRequest, NowResponse } from '@vercel/node'

export default async (
  { query: { name = 'count' } }: NowRequest,
  { json, status, send }: NowResponse
) => {
  const { GH_TOKEN, GIST_ID } = process.env
  if (!GH_TOKEN || !GIST_ID) {
    status(503)
    return send('No `GH_TOKEN` or `GIST_ID` provided')
  }
  if (Array.isArray(name)) {
    status(400)
    return send('Mutiple `name` provided')
  }

  const {
    gists: { get, update },
  } = new Octokit({ auth: GH_TOKEN })
  const {
    data: { files },
  } = await get({ gist_id: GIST_ID })
  const [[filename, { content }]] = Object.entries(files)

  let data: Record<string, number>

  try {
    const parsed = JSON.parse(content!)
    data = {
      ...parsed,
      [name]: ++parsed[name] || 1,
    }
  } catch {
    data = { [name]: 1 }
  }

  await update({
    gist_id: GIST_ID,
    files: {
      [filename]: {
        filename: 'counter.json',
        content: JSON.stringify(data),
      },
    },
  })

  json({ [name]: data[name] })
}
