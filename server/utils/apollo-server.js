const jwt = require('jsonwebtoken');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('apollo-server');
const pubSub = new PubSub();
const IS_USER_ONLINE = 'IS_USER_ONLINE';


const checkAuthorization = (token) => {
  return new Promise(async (resolve, reject) => {
    if(token === undefined) return null
    const authUser = await jwt.verify(token, process.env.JWT_SECRET);

    if (authUser) {
      resolve(authUser);
    } else {
      reject("Couldn't authenticate user");
    } 
  });
};


module.exports = createApolloServer = (typeDefs, resolvers, models) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }
      let authUser = null;
      if (req.headers.authorization !== 'null') {
        const user = await checkAuthorization(req?.headers?.authorization);
        if (user) {
          authUser = user;
        }
      }
      
      return Object.assign({authUser}, {models});
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket, context) => {
        
        if (connectionParams.authorization) {
          const user = await checkAuthorization(connectionParams.authorization);

          pubSub.publish(IS_USER_ONLINE, {
            isUserOnline: {
              userId: user.id,
              isOnline: true,
            },
          });
         return {
            authUser: user,
          };
        }
      },
      onDisconnect: async (webSocket, context) => {
        
        const c = await context.initPromise;
        if (c && c.authUser) {
          
          pubSub.publish(IS_USER_ONLINE, {
            isUserOnline: {
              userId: c.authUser.id,
              isOnline: false,
            },
          });

   
          await models.findOneAndUpdate(
            { email: c.authUser.email },
            {
              isOnline: false,
            }
          );
        }
      },
    },
  });
};