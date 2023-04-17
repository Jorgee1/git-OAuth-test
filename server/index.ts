import Fastify from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { fastifyCookie } from '@fastify/cookie'
import { appRouter, AppRouter, createContext } from './trpc'
import { port } from './config'

const fastify = Fastify()

fastify.register(fastifyTRPCPlugin<AppRouter>, {
    trpcOptions: {
        router: appRouter, createContext
    },
    prefix: '/trpc'
})

fastify.register(fastifyCookie, {
    secret: process.env.SECRET_KEY || '--KEY--',
    parseOptions: {
        //secure: true,
        httpOnly: true,
        sameSite: 'strict',
        path: '/'
    }
})

const main = async () => {
    await fastify.listen({ port })
}

main()