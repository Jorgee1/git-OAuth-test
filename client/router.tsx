import { createBrowserRouter } from 'react-router-dom'
import { Home, Login, Home2 } from './pages'
import { Auth, authLoader, ProtectedRoute } from './auth'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/home2',
                element: <Home2/>
            }
        ]
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/auth',
        element: <Auth/>,
        loader: authLoader
    }
])

