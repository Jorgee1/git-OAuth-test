import Fastify from 'fastify'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter, AppRouter } from './trpc'

const fastify = Fastify()
fastify.register(fastifyTRPCPlugin<AppRouter>, { trpcOptions: { router: appRouter } })

const main = async () => {
    await fastify.listen({ port: 3000 })
}

main()