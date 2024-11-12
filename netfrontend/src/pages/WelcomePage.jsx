import React from "react"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

function WelcomePage() {

    const navigate = useNavigate()

    return (
        <div className="main-div">
            <div className="flex-inline-between">
                <h1>NetRaiss</h1>
                <div className="button-container">
                    <Button 
                        variant="outlined"
                        color="primary"
                        sx={{borderRadius: '20px'}}
                        onClick={() => navigate('/register')}
                    >
                        <h3>Sign in</h3>
                    </Button>
                    <Button 
                        variant="outlined"
                        color="secondary"
                        sx={{borderRadius: '20px'}}
                        onClick={() => navigate('/login')}
                    >
                        <h3>Login</h3>
                    </Button>
                </div>
            </div>
            <div className="flex-column-center">
                <h1 style={{color: 'purple'}}>Welcome to NetRaiss 🎉</h1>
                <h2>This full stack demo web application project is a social media platform that allows users to share their thoughts with the world, follow their friends and interact with their posts.</h2>
                <h2 style={{marginTop: 0}}>NetRaiss has a backend (Django/DRF) that handles api requests and authenticaion (JWT), a frontend (React/MUI), a database (Sqlite), containerized with Docker and hosted on AWS.</h2>
                <h2>Please Sign in to check the features of the app.</h2>
            </div>
        </div>
    )
}

export default WelcomePage