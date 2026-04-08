import React, { useState } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import img from '../../assets/login.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })

      if (error) {
        throw error
      }

      const user = data?.user

      if (user) {
        localStorage.setItem('email', user.email || '')
        localStorage.setItem('uid', user.id || '')
        alert('Login successful!')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error.message)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-left'>
          <img src={img} alt='login visual' />
        </div>

        <div className='login-boxes login-right'>
          <h2 className='login-heading'>Login</h2>

          <form onSubmit={submitHandler} autoComplete='off'>
            <input type='text' name='fakeusernameremembered' style={{display:'none'}} />
            <input type='password' name='fakepasswordremembered' style={{display:'none'}} />
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='login-input'
              type='email'
              name='email'
              placeholder='Enter your email'
              autoComplete='off'
            />

            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='login-input'
              type='password'
              name='password'
              placeholder='Enter your password'
              autoComplete='new-password'
            />

            <button
              className='login-input login-btn'
              type='submit'
              disabled={loading}
            >
              {loading && <i className='fa-solid fa-sync fa-spin'></i>} {loading ? 'Please wait...' : 'Submit'}
            </button>
          </form>

          <div className='test-credentials'>
            <p>Test credentials</p>
            <p>Email: abhi1@gmail.com</p>
            <p>Password: 51141120</p>
          </div>

          <Link to='/register' className='register-link'>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
