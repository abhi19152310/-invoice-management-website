import React, { useState } from 'react'
import '../login/login.css'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import img from '../../assets/login.png'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password
      })

      if (error) {
        throw error
      }

      if (data?.session && data?.user) {
        localStorage.setItem('email', data.user.email || '')
        localStorage.setItem('uid', data.user.id || '')
        alert('Registration successful!')
        navigate('/dashboard')
      } else {
        alert('Registration successful! Please check your email and verify your account before logging in.')
        navigate('/login')
      }
    } catch (error) {
      console.error('Register error:', error.message)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-left'>
          <img src={img} alt='register visual' />
        </div>

        <div className='login-boxes login-right'>
          <h2 className='login-heading'>Register</h2>

          <form onSubmit={submitHandler} autoComplete='off'>
            <input type='text' name='fakeusernameremembered' style={{display:'none'}} />
            <input type='password' name='fakepasswordremembered' style={{display:'none'}} />
            <input
              required
              className='login-input'
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='off'
            />

            <input
              required
              minLength={6}
              className='login-input'
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Link to='/login' className='register-link'>
            Login with your account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
