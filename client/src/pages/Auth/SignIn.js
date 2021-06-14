import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { GET_ALL_USERS, SIGN_IN } from '../../utils/graphql';
import useForm from '../../hooks/useForm';
import { Button, Form} from 'react-bootstrap';


const SignIn = ({ history, location, refetch }) => {
  const {inputs, handleChange} = useForm({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [signin, { loading }] = useMutation(SIGN_IN);


  useEffect(() => {
    setError('');
  }, [location.pathname]);


  const handleSubmitSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await signin({
        variables: {  email, password  },
        refetchQueries: [{query: GET_ALL_USERS}]
      });
      localStorage.setItem('token', response.data.signin.token);
      await refetch();
      history.push('/');
    } catch (error) {
      setError(error.graphQLErrors[0].message);
    }
  };

  const { email, password } = inputs;

  return (
    
      <Form onSubmit={handleSubmitSignIn}>
        <Form.Group>
        <Form.Label>E-Mail</Form.Label>
          <Form.Control name="email" type="text" value={email} placeholder="email" onChange={handleChange} />
        </Form.Group>
    
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={password} placeholder="password" onChange={handleChange}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
   
  );
};

SignIn.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignIn);