import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { useStore } from '../store/store';
import { SET_AUTH_USER } from '../store/auth';
import { TableUsers } from '../components/Table';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS, LOG_OUT } from '../utils/graphql';
import { Button, Container } from 'react-bootstrap';

const AppLayout = ({ location, authUser, refetch:refetchUser }) => {
  const [{ auth }, dispatch] = useStore();


  useEffect(() => {
    dispatch({ type: SET_AUTH_USER, payload: authUser });
  }, [dispatch, authUser]);

  const {data, loading, error, refetch: refetchAllUsers} = useQuery(GET_ALL_USERS)

  const users = data ? data?.allUsers : [];
  const userId = auth?.user?.id;
  const [logout, {loading: loadingLogout}] = useMutation(LOG_OUT)

  const handlerLogOut = async () => {
    window.localStorage.removeItem('token');
    await logout({
      variables: {
        userId
      }
    })
    await refetchUser()
  }

  if (!auth.user) return null;
  if(loading) return (<div>Loading...</div>)

  return (
    <Container className="vh-100">
    <Button variant="danger" onClick={handlerLogOut}>Log Out</Button>
    {data && <TableUsers data={users} refetchUser={refetchUser} loadingAllUsers={loading} refetchAllUsers={refetchAllUsers}/>}
    </Container>
  );
};

AppLayout.propTypes = {
  location: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
};

export default withRouter(AppLayout);