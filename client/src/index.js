import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
	ApolloClient,
	createHttpLink,
	ApolloLink,
	InMemoryCache,
	concat,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { Authentication } from './auth/authentication';

const httpLink = createHttpLink({
	uri: 'http://localhost:5000/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
	const token = Authentication.getToken();
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: token || null,
		},
	}));
	return forward(operation);
});

const client = new ApolloClient({
	link: concat(authMiddleware, httpLink),
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
		<ToastContainer />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
