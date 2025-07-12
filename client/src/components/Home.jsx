import React from 'react'
import {useNavigate} from 'react-router-dom'
import { NavLink } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const signup = (e)=>{
    navigate('/signup')
  }
  const login = (e)=>{
    navigate('/login')
  }
  const dashboard = (e)=>{
    navigate('/dashboard')
  }
  const admin = (e)=>{
    navigate('/admin')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Swap Platform</h1>
          <p className="text-gray-600 mb-8">Exchange skills with others and grow together</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Demo Access (No Login Required):</h2>
          
          <button 
            onClick={dashboard}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
          
          <button 
            onClick={admin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Go to Admin Panel
          </button>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">Or use traditional authentication:</p>
            
            <div className="space-y-3">
              <button 
                onClick={signup}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>

              <button 
                onClick={login}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home