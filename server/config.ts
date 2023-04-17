import { z } from 'zod'
import { readFileSync } from 'fs'

const getCredentials = (path: string) => {
    const credentialsSchema = z.object({
        clientId: z.string(),
        clientSecret: z.string()
    })
    const rawCredentials = readFileSync(path, 'utf-8')
    const parsedCredentials = JSON.parse(rawCredentials)

    return credentialsSchema.parse(parsedCredentials)
}

export const { clientId, clientSecret } = getCredentials('credentials.json')

export const port = 3000
