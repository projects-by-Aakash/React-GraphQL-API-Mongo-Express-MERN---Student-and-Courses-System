// Load the module dependencies
const configureMongoose = require('./config/mongoose');
const configureExpress = require('./config/express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/graphqlSchemas');
const cors = require('cors');
const verifyToken = require('./helpers/jwt');

// port define
const port = process.env.PORT || 5000;

// Create a new Mongoose connection instance
const db = configureMongoose();

// Create a new Express application instance
const app = configureExpress;

//configure GraphQL to use over HTTP
app.use('*', cors());

// token verify middleware
app.use(verifyToken);

app.use(
	'/graphql',
	cors(),
	graphqlHTTP({
		schema: schema,
		rootValue: schema,
		graphiql: true,
		pretty: true,
	})
);

// Use the Express application instance to listen to the '5000' port
app.listen(port, () =>
	console.log(`GraphQL Server Now Running On http://localhost:${port}/graphql`)
);
