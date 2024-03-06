import {type RouteHandler} from 'itty-router'

export const githubFileTree: RouteHandler = async (request) => {
	const {user, repo, tree = 'HEAD'} = request.query

	const findPage = await fetch(`https://github.com/${user}/${repo}/find/${tree}`)
		.then(response => response.text())

	const treeId = findPage.match(/\/tree-list\/([0-9a-f]{40})/)[1]

	const treeList = await fetch(`https://github.com/${user}/${repo}/tree-list/${treeId}`, {
		headers: {
			'x-requested-with': 'XMLHttpRequest'
		}
	})

	return new Response(treeList.body, {
		headers: {
			'access-control-allow-origin': '*',
			'cache-control': 'max-age=86400, s-maxage=86400',
			'content-type': 'application/json',
		}
	})
}
