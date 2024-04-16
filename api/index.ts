import {Router} from 'itty-router'
import {createServerAdapter} from '@whatwg-node/server'

import {githubFileContributors} from '../routes/api/github-file-contributors.js'
import {githubFileTree} from '../routes/github-file-tree.js'

const router = Router()

router.get('/api/github-file-contributors', githubFileContributors)
router.get('/github-file-tree', githubFileTree)

export default createServerAdapter(router.fetch)
