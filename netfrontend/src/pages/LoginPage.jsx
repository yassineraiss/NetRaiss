import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom' 
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { TextField, Button, CircularProgress } from '@mui/material'

function LoginPage() {

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(false)
    const [label, setLabel] = useState('Enter your password')

    const navigate = useNavigate()

    const handleLogin = async () => {
        if(username && password ) {
            setLoading(true)
            try {
                const response = await api.post("/api/access-token", {
                    username: username,
                    password: password
                })
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/")
            } catch(error) {
                setLoading(false)
                setError(true)
                setLabel('password or username are not valid.')
                throw(error)
            }
        }
    }

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100vh'
        }}>
            <div className='flex-column-center'>
                <h1 style={{
                    fontFamily: 'Dosis',
                    marginTop: 0,
                    marginBottom: '2rem',
                    color: 'purple'
                }}>
                    Login to NetRaiss
                </h1>
                <TextField 
                    color='secondary'
                    label='Enter a username'
                    type='text'
                    sx={{mb: '1rem'}}
                    onChange={(e) => {setUsername(e.target.value)}}
                />
                <TextField 
                    color='secondary'
                    label={label}
                    error={error}
                    type='password'
                    sx={{mb: '2rem'}}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                {
                    loading ?
                    <CircularProgress color='secondary' />
                    :
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={handleLogin}
                        style={{
                            borderRadius: '20px',
                        }}
                    >
                        <h3 style={{
                            fontFamily: 'Dosis',
                            margin: 0,
                            color: 'inherit'
                        }}>
                            Login
                        </h3>
                    </Button>
                }
                <Button
                    variant='contained'
                    color='inherit'
                    onClick={() => {navigate('/register')}}
                    style={{
                        borderRadius: '20px',
                        marginTop: '1rem'
                    }}
                >
                    <h3 style={{
                        fontFamily: 'Dosis',
                        margin: 0
                    }}>
                        Sign in here if you're new.
                    </h3>
                </Button>
            </div>
        </div>
    )
}

export default LoginPage