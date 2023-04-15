import {useState} from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'

import type { AppRouter } from '../server/trpc'


const Home = () => {
    return <div>Home</div>
}

const Login = () => {
    return <div>Login</div>
}

const trpc = createTRPCReact<AppRouter>()

const App = () => {
    const [ trpcClient ] = useState(() => trpc.createClient({links: [httpBatchLink({url: '/trpc'})]}))
    const [ queryClient ] = useState(() => new QueryClient())

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home/>
        },
        {
            path: '/login',
            element: <Login/>
        }
    ])

    return <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </trpc.Provider>
}

const main = () => {
    const root = document.createElement('div')
    document.body.replaceChildren()
    document.body.appendChild(root)
    createRoot(root).render(<App/>)
}
main()