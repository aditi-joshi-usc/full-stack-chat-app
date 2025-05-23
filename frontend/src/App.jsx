import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import SignupPage from './pages/SignupPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()
useEffect(() => {  
  checkAuth()
}, [checkAuth])

console.log('authUser', authUser)
console.log(onlineUsers)

if (isCheckingAuth && !authUser) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="size-12 animate-spin" />
    </div>
  )
}

  return (
    <div data-theme={theme}>

      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage />:<Navigate to="/login" />} />
        <Route path="/signup" element={ !authUser ? <SignupPage />:<Navigate to="/" />} />
        <Route path="/login" element={ !authUser ? <LoginPage />:<Navigate to="/" />} /> 
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage />:<Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>    
  )
}

export default App