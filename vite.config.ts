import { defineConfig } from 'vite'
import { port } from './server/config'

export default defineConfig({
    server: {
        proxy: {
            '/trpc': {
                target: `http://localhost:${port}`
            }
        }
    }
})