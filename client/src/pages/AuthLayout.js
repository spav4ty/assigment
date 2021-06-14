import React from 'react';
import PropTypes from 'prop-types';

import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import {Row, Container } from 'react-bootstrap';

const AuthLayout = ({ refetch }) => {
  return (
    <>
    <Container>
      <Row className="justify-content-between gap-10 align-items-center vh-100">
        <SignIn refetch={refetch} />
        <SignUp refetch={refetch}/>
      </Row>
    </Container>
    
    </>
  );
};

AuthLayout.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthLayout;