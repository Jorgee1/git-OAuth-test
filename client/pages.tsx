import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trpc } from './trpc'
import { useAuthContext } from './auth'

export const Nav = () => {
    const { logOut } = useAuthContext()
    const { data } = trpc.whoami.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    return <nav>
        <Link to="/">Home</Link>
        <Link to="/home2">Home2</Link>
        <span>{data? data.name: 'Username'}</span>
        <button onClick={logOut}>LogOut</button>
    </nav>
}

export const Home = () => {
    return <>
        <Nav/>
        <div>Home</div>
    </>
}


export const Home2 = () => {
    return <>
        <Nav/>
        <div>HOME2</div>
    </>
}

export const Login = () => {
    const [url, setURL] = useState('')

    trpc.authURL.useQuery(undefined, {
        onSuccess: (responseURL) => {
            setURL(responseURL)
        }
    })

    const click = () => {
        window.location.replace(url)
    }

    return <div>
        <h1>Login</h1>
        <button onClick={click} disabled={url? false: true}>GitHub</button>
    </div>
}

