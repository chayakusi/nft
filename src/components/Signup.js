import React, { useRef, useState } from 'react'
import { Col, Form , Button ,Card, FormControl, Row, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link , useNavigate } from 'react-router-dom'

export const Signup = (props) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
    //  navigate('/')    
    } catch {
      setError("Failed to create an account") 
    }

    setLoading(false)
  }

  return (
    <>
    <Card>
        <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
        
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>

            <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="firstname" placeholder="Enter First Name" />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="lastname" placeholder="Enter Last Name" />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} id ="email" controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" ref= {emailRef} placeholder="Enter email" />
        </Form.Group>

        <Form.Group as={Col} id ="password" controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" ref= {passwordRef} placeholder="Enter password" />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Address</Form.Label>
        <Form.Control placeholder="1234 Main St" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridPhoneNo">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control placeholder="Phone Number" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridCellPhoneNo">
        <Form.Label>Cell Phone Number</Form.Label>
        <Form.Control placeholder="Cell-Phone Number" />
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Control />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>State</Form.Label>
          <Form.Select defaultValue="Choose...">
            <option>Choose...</option>
            <option>Alabama</option><option>Alaska</option><option>Arizona</option><option>Arkansas</option><option>California</option><option>Colorado</option><option>Connecticut</option><option>Delaware</option><option>Florida</option><option>Georgia</option><option>Hawaii</option><option>Idaho</option><option>Illinois</option><option>Indiana</option><option>Iowa</option><option>Kansas</option><option>Kentucky</option><option>Louisiana</option><option>Maine</option><option>Maryland</option><option>Massachusetts</option><option>Michigan</option><option>Minnesota</option><option>Mississippi</option><option>Missouri</option><option>Montana</option><option>Nebraska</option><option>Nevada</option><option>New Hampshire</option><option>New Jersey</option><option>New Mexico</option><option>New York</option><option>North Carolina</option><option>North Dakota</option><option>Ohio</option><option>Oklahoma</option><option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option><option>South Carolina</option><option>South Dakota</option><option>Tennessee</option><option>Texas</option><option>Utah</option><option>Vermont</option><option>Virginia</option><option>Washington</option><option>West Virginia</option><option>Wisconsin</option><option>Wyoming</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Zip</Form.Label>
          <Form.Control />
        </Form.Group>
      </Row>

      <Button disabled={loading} className='w-100' variant="primary" type="submit">
        Submit
      </Button>
    </Form>
        </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
    </div>
    </>
  )
}
