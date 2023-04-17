import { useState, ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../server/trpc'


export const trpc = createTRPCReact<AppRouter>()

export const createTRPCClient = () => trpc.createClient({
    links: [
        httpBatchLink({url: '/trpc'})
    ]
})


export const TRPCProvider = ({children}: {children: ReactElement}) => {
    const [ trpcClient ] = useState(() => createTRPCClient())
    const [ queryClient ] = useState(() => new QueryClient())

    return <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </trpc.Provider>
}