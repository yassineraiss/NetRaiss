import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import ErrorPage from "./pages/ErrorPage"
import ProtectedRoute from "./components/ProtectedRoute"
import Following from "./pages/FollowingPage"
import Profile from "./pages/ProfilePage"
import WelcomePage from "./pages/WelcomePage"
import HomePage from "./pages/HomePage"

function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
}

function RegisterAndLogout() {
    localStorage.clear()
    return <RegisterPage />
}

function App() {
	return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/profile/:profilename" element={<Profile />} />
                <Route path="/following" element={<Following />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
