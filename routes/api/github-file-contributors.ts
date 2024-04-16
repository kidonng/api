import {type RequestHandler, json} from 'itty-router'

export const githubFileContributors: RequestHandler = async (request) => {
	const {user, repo, tree = 'HEAD', path} = request.query

	const html = await fetch(
		`https://github.com/${user}/${repo}/contributors-list/${tree}/${path}`,
	).then((response) => response.text())
	const contributors = [...html.matchAll(/u\/(\d+).+\s+([\w-]+)/g)].map(
		([, id, username]) => ({id, username}),
	)

	return json(contributors, {
		headers: {
			'access-control-allow-origin': '*',
			'cache-control': 'max-age=86400, s-maxage=86400',
		},
	})
}
