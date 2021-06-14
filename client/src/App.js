import React from 'react';
import { useQuery } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { GET_AUTH_USER } from './utils/graphql';

import AuthLayout from './pages/AuthLayout';
import AppLayout  from './pages/AppLayout';

const App = () => {

  const { loading, data, error, refetch } = useQuery(GET_AUTH_USER);

  if (loading) return (<div>Loading...</div>);
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Router>
        <Switch>
          {data.getAuthUser ? (
            <Route exact render={() => <AppLayout authUser={data.getAuthUser} refetch={refetch} />} />
          ) : (
            <Route exact render={() => <AuthLayout refetch={refetch} />} />
          )}
        </Switch>
    </Router>
  );
};

export default App;