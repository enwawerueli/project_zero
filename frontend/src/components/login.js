import React, { useState, useContext } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';

import Home from './home';
import { AppContext } from '../store';

export default function Login() {

  const {setLoggedUser} = useContext(AppContext);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  function doLogin(e) {

    e.preventDefault();
    const form = e.currentTarget;
    setValidated(true);
    if (form.checkValidity() === false) return;
    axios
      .post(`/api/login`, { user_id: userId, password })
      .then(result => {
        if (result.data.logged_in) {
          setLoggedUser(result.data.username);
          NotificationManager.success(result.data.message);
        } else {
          if ('authentication_error' in result.data) {
            NotificationManager.error(result.data.message);
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <Home>
      <Col md={4} className="jumbotron">
        <h1>Login</h1>
        <hr className="my-2"/>
        <Form noValidate validated={validated} onSubmit={doLogin}>
          <Form.Group controlId="userId">
            <Form.Label>User ID</Form.Label>
            <Form.Control type="email" placeholder="Username or Email" name="user_id" value={userId} onChange={e => setUserId(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
              Please enter your user ID.
          </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
          </Form.Control.Feedback>
          </Form.Group>
          <Button variant="success" type="submit">Submit</Button>
        </Form>
        <p className="mt-4">Don't have an account?&nbsp;<Link to="/signup">Signup</Link></p>
      </Col>
    </Home>
  );
}
