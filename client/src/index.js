import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from './utils/apollo-client';
import { StoreProvider } from './store/store';
import {endpoint} from './config';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

const api_url = endpoint;
const websocketApiUrl = endpoint.replace('http://', 'ws://');

const apolloClient = createApolloClient(api_url, websocketApiUrl);

render(
  <ApolloProvider client={apolloClient}>
      <StoreProvider>
        <App />
      </StoreProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
