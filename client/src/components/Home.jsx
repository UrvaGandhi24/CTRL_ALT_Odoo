import React from 'react'
import {useNavigate} from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import './Home.css'

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
    <div className="home-container">
      {/* Background Animation */}
      <div className="home-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>

      <div className="home-card">
        {/* Header */}
        <div className="home-header">
          <div className="home-logo">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="home-title">SkillSwap Platform</h1>
          <p className="home-subtitle">Exchange skills with others and grow together in a collaborative learning environment</p>
        </div>
        
        {/* Demo Access Section */}
        <div className="demo-section">
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Quick Demo Access
          </h2>
          
          <div className="demo-buttons">
            <button onClick={dashboard} className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Explore Dashboard
            </button>
            
            <button onClick={admin} className="btn btn-secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 1L3 5V11C3 16 6 20 12 23C18 20 21 16 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Panel
            </button>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="features">
          <h3 className="features-title">Why Choose SkillSwap?</h3>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 1.17157 16.1716C0.42143 16.9217 0 17.9391 0 19V21" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15C17.9391 15 16.9217 15.4214 16.1716 16.1716C15.4214 16.9217 15 17.9391 15 19V21" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="feature-content">
                <h4>Connect Globally</h4>
                <p>Network with skilled professionals worldwide</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17 16L21 12L17 8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 12H15" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="feature-content">
                <h4>Fair Exchange</h4>
                <p>Trade skills in a balanced ecosystem</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="feature-content">
                <h4>Grow Together</h4>
                <p>Learn new skills while teaching others</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1K+</div>
            <div className="stat-label">Skills Shared</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="divider-section">
          <div className="divider">
            <span className="divider-text">Or get started with your account</span>
          </div>
        </div>
        
        {/* Authentication Section */}
        <div className="auth-section">
          <p className="auth-description">Join our community to start your skill-sharing journey</p>
          
          <div className="auth-buttons">
            <button onClick={signup} className="btn btn-outline">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8V14" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 11H17" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Create Account
            </button>

            <button onClick={login} className="btn btn-outline">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home