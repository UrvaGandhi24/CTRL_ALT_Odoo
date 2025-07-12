import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Profile from './components/Profile'
import Search from './components/Search'
import UserProfile from './components/UserProfile'
import SwapRequests from './components/SwapRequests'
import CreateSwapRequest from './components/CreateSwapRequest'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './contexts/ToastContext'

const router = createBrowserRouter(
  // routing happens here 
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forgotpass' element={<ForgotPassword />}/>
      <Route path='/resetpassword/:token' element={<ResetPassword />} />
      
      {/* Direct Access Routes (bypassing authentication) */}
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/search' element={<Search />} />
      <Route path='/user/:id' element={<UserProfile />} />
      <Route path='/swaps' element={<SwapRequests />} />
      <Route path='/create-swap/:userId' element={<CreateSwapRequest />} />
      
      {/* Admin Routes (direct access) */}
      <Route path='/admin' element={<AdminDashboard />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} /> 
    </ToastProvider>
  </StrictMode>,
)
