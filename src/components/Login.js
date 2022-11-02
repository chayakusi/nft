import React, { useRef, useState } from 'react'
import {  Form , Button ,Card, FormControl, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login  } = useAuth();
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
        navigate('/dashboard')
    } catch {
      setError("Failed to log in") 
    }

    setLoading(false)
  }

  return (
    <>
    <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
            
            <Form.Group id="emailRef"className="mb-3" controlId="formGridEmail">
        <Form.Label>Email Address</Form.Label>
        <Form.Control type="email" ref= {emailRef} placeholder="Enter Email Address" />
      </Form.Group>

      <Form.Group id="passwordRef"className="mb-3" controlId="formGridPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" ref= {passwordRef} placeholder="Enter Password" />
      </Form.Group>
      
      <Button disabled={loading} className='w-100' variant="primary" type="submit">
        Log IN
      </Button>
    </Form>
    </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        Need an Account? <Link to="/signup">Sign Up</Link>
    </div>
    </>
  )
}
