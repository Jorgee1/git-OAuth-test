import { z } from 'zod'
import { inferAsyncReturnType, initTRPC } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { getToken, getUser, loginURL } from './github'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export const createContext = ({req, res}: CreateFastifyContextOptions) => ({req, res})
export type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

const db = new PrismaClient()

export const appRouter = t.router({
    authURL: t.procedure
        .query(() => loginURL),
    greeting: t.procedure
        .query(() => 'From tRPC'),
    auth: t.procedure
        .input(z.object({
            code: z.string()
        }))
        .query(async ({input: { code }, ctx: { res } }) => {
            console.log(code)
            const { access_token } = await getToken(code)
            const { id } = await getUser(access_token)

            
            const user = await db.user.findUnique({where: {id}})
            if (!user) await db.user.create({data: {id}})

            const curentSession = await db.session.findUnique({where: {userId: id}})
            if (curentSession) await db.session.delete({where: {userId: id}})

            const session = await db.session.create({data: {token: access_token, userId: id}})

            res.setCookie('token', session.session)
            
            console.log('DONE')
            return true
        }),
    whoami: t.procedure
        .query(async ({ctx: {req}}) => {
            const sessionToken = req.cookies.token
            const session = await db.session.findUnique({where: {session: sessionToken}})
            return await getUser(session?.token || '')
        })
})

export type AppRouter = typeof appRouter