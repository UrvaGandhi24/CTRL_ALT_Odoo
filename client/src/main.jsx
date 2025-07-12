import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom'
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
import AdminProfileView from './components/AdminProfileView'

const router = createBrowserRouter(
  // routing happens here 
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Navigate to="/dashboard" replace />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forgotpass' element={<ForgotPassword />} />
      <Route path='/resetpassword/:token' element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/search' element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path='/user/:id' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path='/swaps' element={<ProtectedRoute><SwapRequests /></ProtectedRoute>} />
      <Route path='/create-swap/:userId' element={<ProtectedRoute><CreateSwapRequest /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path='/admin' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path='/admin-user-profile/:id'  element={<ProtectedRoute><AdminProfileView /></ProtectedRoute>} />
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
