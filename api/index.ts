import {Router} from 'itty-router'
import {createServerAdapter} from '@whatwg-node/server'

import {githubFileContributors} from '../routes/api/github-file-contributors.js'

const router = Router()

router.get('/api/github-file-contributors', githubFileContributors)

export default createServerAdapter(router.handle)
