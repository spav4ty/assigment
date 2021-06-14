const bcrypt = require('bcryptjs')
const { withFilter } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { PubSub } = require('apollo-server');
const pubSub = new PubSub();
const IS_USER_ONLINE = 'IS_USER_ONLINE';

const generateToken = (user, secret) => {
  const { id,email } = user;
  const token = jwt.sign({id,email}, secret);
  return token;
};

module.exports = {
  Query: {
    allUsers: async (parent, args, {authUser, models}, info) => {
      return await models.find();
    },
    getAuthUser: async (root, args, { authUser, models }) => {
      if (!authUser) return null;
      

      const user = await models.findOneAndUpdate({ email: authUser.email }, { isOnline: true, lastLoginAt:Date.now() })
      if(user.active === false) return null;
      return user;
    },
  },
  Mutation: {
    signup: async (parent,{ userInput:{email,password,name}}, {authUser, models}, info) => {
      const existingUser = await models.findOne({ email });
      if (existingUser) {
        const error = new Error('User exists already!');
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);
      
      const user = new models({
        email: email,
        name: name,
        password: hashedPw,
      });

      const createdUser = await user.save();
      
      const token = generateToken(createdUser, process.env.JWT_SECRET)
      return {
        token
      }
    },
    signin: async (parent, {email, password} , {authUser, models}, info) => {
      if(!email || !password) {
        throw new Error('Please provide email and password!');
      }

      const user = await models.findOne({email}).select('+password')

      if(!user){
        error = new Error('Incorrect email')
        error.code = 401;
        throw error;
      }

      const correct = await user.correctPassword(password, user.password)
      if(!correct) {
        throw new Error('Incorrect password')
      }

      const token = generateToken(user, process.env.JWT_SECRET)
      return {
        token
      }
    },
    logout:  async(parent, {userId}, {authUser, models}, info) => {
      await models.findOneAndUpdate({ '_id': userId.id }, { isOnline: false, lastLoginAt:Date.now() })
      return {
        boolean: true
      }
    },
    deleteUsers: async(parent, {usersIds} , {authUser, models}, info) => {
      let count = 0;
      for(count; count < usersIds.length; count++) {
        await models.deleteOne(
          {"_id": usersIds[count]}
        )
      };
      return {
        count
      };
    },
    blockUsers: async(parent, {usersIds} , {authUser, models}, info) => {
      let count = 0;
      for(count; count < usersIds.length; count++) {
        await models.updateOne(
          {"_id": usersIds[count]}, {active: false}
        )
      };
      return {
        count
      };
    },
    unBlockUsers: async(parent, {usersIds} , {authUser, models}, info) => {
      let count = 0;
      for(count; count < usersIds.length; count++) {
        await models.updateOne(
          {"_id": usersIds[count]}, {active: true}
        )
      };
      return {
        count
      };
    } 
  },
   Subscription: {
    isUserOnline: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(IS_USER_ONLINE),
        (payload, variables, context) =>  variables.authUserId === context.authUser.id
      ),
    },
   }
};
