import { z } from 'zod'
import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { getToken, getUser, loginURL } from './github'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export const createContext = ({req, res}: CreateFastifyContextOptions) => ({req, res})
export type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()
const publicProcedure = t.procedure
const privateProcedure = t.procedure.use(async ({ctx, next}) => {
    const { req } = ctx
    const sessionToken = req.cookies.token || ''
    const session = await db.session.findUnique({where: {session: sessionToken}})

    if (!session) throw new TRPCError({code: 'UNAUTHORIZED'})
    if (!session.token) throw new TRPCError({code: 'UNAUTHORIZED'})

    const user = await getUser(session.token)
    if ('message' in user) throw new TRPCError({code: 'UNAUTHORIZED'})

    return next({
        ctx: {user}
    })
})
const db = new PrismaClient()

export const appRouter = t.router({
    authURL: publicProcedure
        .query(() => loginURL),
    greeting: privateProcedure
        .query(({ctx: {user}}) => `Hello ${ user.name } From tRPC`),
    auth: publicProcedure
        .input(z.object({
            code: z.string()
        }))
        .query(async ({input: { code }, ctx: { res } }) => {
            console.log(code)
            const { access_token } = await getToken(code)
            const response = await getUser(access_token)
            if ('message' in response) return false
            const { id } = response

            const user = await db.user.findUnique({where: {id}})
            if (!user) await db.user.create({data: {id}})

            const curentSession = await db.session.findUnique({where: {userId: id}})
            if (curentSession) await db.session.delete({where: {userId: id}})

            const session = await db.session.create({data: {token: access_token, userId: id}})

            res.setCookie('token', session.session)
            
            console.log('DONE')
            return true
        }),
    whoami: privateProcedure
        .query(async ({ctx: {user}}) => {
            return user
        })
})

export type AppRouter = typeof appRouter