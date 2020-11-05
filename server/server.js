//NODE IMPORTS
const path = require('path');
require('dotenv').config();
// console.log(process.env.NODE_ENV);
//EXPRESS IMPORTS AND SERVER PORT ASSIGN
const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();

//APOLLO IMPORTS
const { ApolloServer } = require('apollo-server-express');

//GRAPHQL TYPEDEFS AND RESOLVES AND CONNECTION
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

//AUTHORIZATION MIDDLEWARE
const { authMiddleware } = require('./utils/auth.js');

//APOLLO SERVER INITIALIZE
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});
//APPLY APOLLO MIDDLEWARE TO EXPRESS APP
apolloServer.applyMiddleware({ app });

//EXPRESS MIDDLEWARE FUNCTIONS
app.use(express.urlencoded({ extended: false }));
//STATIC PUBLIC FRONT END ASSETS WHILE IN DEVELOPMENT
// app.use('/images', express.static(path.join(__dirname, '../client/images')));

//IF-ENV IN DEPLOYMENT
if (process.env.NODE_ENV === 'production') {
  //STATIC ASSETS FROM REACT BUILD FOLDER
  app.use(
    express.static(
      path.join(__dirname, '../client/build')
    )
  );
  // IF TRAVELS ANY ROUTE OUTSIDE REACT'S CURRENT PAGE REDIRECT TO ROOT
  app.get('*', (req, res) => {
    console.log("IN THE GET STAR");
    res.sendFile(
      path.join(
        __dirname, '../client/build/index.html'
      )
    )
  });
  //REDIRECT HTTP TRAFFIC TO HTTPS
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

//OPEN DATABASE AND THEN START SERVER
db.once('open', () => {
  app.listen(PORT, () => {
    //SERVER LISTENING ON PORT
    setTimeout(() => {
      console.log("\x1b[33m",`🔊 🎶 now listening on port ${PORT} 🔊 🎶`, "\x1b[00m");
    }, 300);
    setTimeout(() => {
      console.log("\x1b[34m", `🌎 node environment install success listening on port ${PORT} 🌎`, "\x1b[00m");
    }, 400);
    //GRAPHQL URL
    setTimeout(() => {
      console.log("\x1b[35m", `🔮 if in dev phase use graphql at http://localhost:${PORT}${apolloServer.graphqlPath} 🔮`, "\x1b[00m");
    }, 500);
    setTimeout(() => {
      console.log("\x1b[32m", `🌱 if in development: stand by for react server to begin...`, "\x1b[00m");
    }, 600);
  })
})