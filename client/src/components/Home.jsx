import React from 'react'
import {useNavigate} from 'react-router'
import { NavLink } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const signup = (e)=>{
    navigate('/signup')
  }
  const login = (e)=>{
    navigate('/login')
  }
  return (
    <>
        <button onClick={signup}>SignUp</button>

        <button onClick={login}>LogIn</button>
    </>
  )
}

export default Home