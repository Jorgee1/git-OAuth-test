import { createContext, useContext, ReactElement, useState, useEffect } from 'react'
import { useLoaderData, LoaderFunctionArgs, useNavigate, Outlet, Navigate } from 'react-router-dom'
import { trpc } from './trpc'


export const authContext = createContext({
    isAuthed: false,
    logIn: () => {},
    logOut: () => {}
})

export const useAuthContext = () => useContext(authContext)

export const AuthProvider = ({children}: {children: ReactElement}) => {
    const storedAuth = window.localStorage.getItem('isAuthed')
    const [isAuthed, setAuth] = useState((storedAuth === 't')? true: false)

    const logIn = () => {
        window.localStorage.setItem('isAuthed', 't')
        setAuth(true)
    }
    const logOut = () => {
        window.localStorage.setItem('isAuthed', 'f')
        setAuth(false)
    }

    return <authContext.Provider value={{isAuthed, logIn, logOut}} children={children}/>
}

export const authLoader = ({request}: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code') || ''
    return {code}
}

export const Auth = () => {
    const navigate = useNavigate()
    const { code } = useLoaderData() as ReturnType<typeof authLoader>
    const { isAuthed, logIn } = useAuthContext()

    trpc.auth.useQuery({code}, {
        onSuccess: async (r) => {
            console.log('Authed completed', r)
            logIn()
        },
        onError: async (r) => {
            console.log('Authed NOT completed', r)
            navigate('/login')
        },
        retry: false
    })

    useEffect(() => {
        if (isAuthed) navigate('/')
    }, [isAuthed])

    return <>Logging in...</>
}

export const ProtectedRoute = () => {
    const { isAuthed, logIn, logOut } = useAuthContext()

    trpc.whoami.useQuery(undefined, {
        onSuccess: () => {
            if (!isAuthed) logIn()
        },
        onError: () => {
            // This might not be the best way of handeling connection issues
            if (isAuthed) logOut()
        }
    })
    
    return isAuthed? <Outlet/>: <Navigate to='/login'/>
}