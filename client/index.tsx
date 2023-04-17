import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { TRPCProvider } from './trpc'
import { router } from './router'
import { AuthProvider } from './auth'


const App = () => (
    <TRPCProvider>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </TRPCProvider>
)

const main = () => {
    const root = document.createElement('div')
    document.body.replaceChildren()
    document.body.appendChild(root)
    createRoot(root).render(<App/>)
}
main()

