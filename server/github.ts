import { z } from 'zod'
import { clientId, clientSecret } from './config'

const tokenSchema = z.object({
    access_token: z.string(),
    token_type: z.string(),
    scope: z.string()
})

const tokenErrorSchema = z.object({
    error: z.string(),
    error_description: z.string(),
    error_uri: z.string()
})

export const loginURL = `https://github.com/login/oauth/authorize?client_id=${clientId}`

export const getToken = async (code: string) => {
    const response = await fetch('https://github.com/login/oauth/access_token', { 
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json'
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
        })
    })

    const unsafeResponse = await response.json()
    console.log('GET TOKEN', unsafeResponse)
    return tokenSchema.parse(unsafeResponse)
}

const userSchema = z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    name: z.string(),
    company: z.string().nullable(),
    blog: z.string(),
    location: z.string().nullable(),
    email: z.string().nullable(),
    hireable: z.string().nullable(),
    bio: z.string(),
    twitter_username: z.string().nullable(),
    public_repos: z.number(),
    public_gists: z.number(),
    followers: z.number(),
    following: z.number(),
    created_at: z.string(),
    updated_at: z.string()
})
const userSchemaError = z.object({
    message: z.string(),
    documentation_url: z.string()
})
export const getUser = async (access_token: string) => {
    const response = await fetch(
        'https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const unsafeResponse = await response.json()
    console.log('GET USER',unsafeResponse)
    const parsedResponse = userSchema.safeParse(unsafeResponse)

    if (!parsedResponse.success) return userSchemaError.parse(unsafeResponse)
    return parsedResponse.data
}