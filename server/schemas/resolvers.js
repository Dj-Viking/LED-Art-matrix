const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order, Preset, SearchTerm, Gif } = require('../models');
const { signToken } = require('../middleware/authMiddleware');
require('dotenv').config();
const fetch = require('node-fetch');
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const uuid = require("uuid");
const { APP_DOMAIN_PREFIX } = require('../constants');
const { sendEmail } = require('../utils/sendEmail');
// const { decodeToken } = require("../utils/decodeToken");
const bcrypt = require("bcrypt");
const { verifyAsync } = require("../utils/verifyAsync");

const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Product.find(params).populate('category');
    },
    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        //console.log(user);

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    getPresets: async (parent, args, context) => {
      try {
        const presets = await Preset.find();
        console.log(presets);
        return presets;
      } catch (error) {
        console.log(error);
      }
    },
    getSearchTerms: async (parent, args, context) => {
      try {
        const searchTerms = await SearchTerm.find();
        return searchTerms;
      } catch (error) { 
        console.error(error);
      }
    },
    getUserDefaultPreset: async (parent, args, context) => {
      if (context.user) {
        //get preset id from user's defaultPreset property
        const userInfo = await User.findById(context.user._id);
        //console.log(userInfo);
        //find the preset name thats in the user's defaultPreset property
        const defaultPreset = await Preset.findById(userInfo.defaultPreset._id);
        //console.log(defaultPreset);

        return defaultPreset;
      } else {
        throw new AuthenticationError('Must be logged in to do that.');
      }
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, args, context) => {
      //make new url to redirect after success purchase
      // console.log(context.headers);
      const url = new URL(context.headers.referer).origin;
      console.log(url);

      const order = new Order//sending product ObjectID's in args.products
      (
        {
          products: args.products
        }
      );
      console.log(order);
      //not actually storing the order in the DB just using it as a way to
      // separate a product model from an order model
      const { products } = await order.populate('products').execPopulate();
      console.log(products);
      
      const line_items = [];
      for (let i = 0; i < products.length; i++) {
        //gen a product id
        const product = await stripe.products.create(
          {
            name: products[i].name,
            description: products[i].description,
            images: [`${url}/images/${products[i].image}`]
            // images: [`https://picsum.photos/280/320?random=4`]
          }
        );

        //gen price id using the product id 
        const price = await stripe.prices.create(
          {
            product: product.id,
            unit_amount: products[i].price * 100,
            currency: 'usd',
          }
        );

        //add price id to the line items array
        line_items.push(
          {
            price: price.id,
            quantity: 1
          }
        );
      }
      //console.log(line_items);

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          success_url: `https://example.com/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `https://example.com/cancel`
          // success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
          // cancel_url: `${url}/`
        }
      );

      return {
        session: session.id
      };
    },
    getGifs: async (parent, args, context) => {
      try {
        const gifs = await Gif.find();
        return gifs;
      } catch (error) {
        console.error(error);
      }
    },
    //SERVER SIDE API FETCH
    getGifsCreateAndOrUpdate: async (parent, args, context) => {
        //get search terms updated into the user after hitting search
        // searching for a category updates the user's userSearchTerm ID string
        // some kind of listener on front end for change of search term state
        // and just dispatch and mutate user on the state change grab which ever 
        // one was first or whichever was chosen.

      try {
        console.log('getting gifs');
        //find the logged in user's search terms 
        // on their database account
        // const userInfo = await User.findById(context.user._id);
        // console.log('get gifs user info')
        // console.log(userInfo);
        //find the name of the search term
        // const searchTermInfo = await SearchTerm.findById(userInfo.userSearchTerm);
        // console.log(searchTermInfo);
        //set searchterm for URL
        // const urlSearchTerm = searchTermInfo.termCategory;
        const userUrlSearchTerm = undefined;
        const altTerm = 'trippy';

        const limitOne = undefined;

        //DYNAMICALLY CHANGE OFFSET?
        // make random choice between numbers for the offset and limit
        function getRandomIntOffset(max) {
          return Math.floor(Math.random() * Math.floor(max));
        }
        //LIMIT RANDOMIZE
        function getRandomIntLimit(_min, _max) {
          let min = Math.ceil(_min);
          let max = Math.floor(_max);
          return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
        }
        let gifLink = '';
        gifLink = 
        `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=trippy&limit=${getRandomIntLimit(10, 15)}&offset=${getRandomIntLimit(1, 5)}&rating=g&lang=en`;

        const gifInfo = await fetch(`${gifLink}`);
        const gifJson = await gifInfo.json();
        //console.log(gifLink);
        //console.log(gifJson.data);
        // console.log(gifJson.data[0].images.original.url);
        //init some tools 
        let newApiGif = {}
        const gifsApiArr = [];
        //fill up the tools
        for (
          let i = 0;
          i < gifJson.data.length;
          i++
        )
        { 
          newApiGif = {
            gifSrc: gifJson.data[i].images.original.url,
            gifCategory: userUrlSearchTerm || altTerm,
            limit: '10' 
          }
          gifsApiArr.push(newApiGif);
        }
        //console.log('BEFORE DATABASE CHECK IF STATEMENT FILL TOOL ARRAY')
        //console.log(gifsApiArr);

        //check if gifs exist already
        const gifDB = await Gif.find();
        //console.log("gifDB exists??? if not this will be empty");
        //console.log(gifDB);
        //console.log(gifDB[0]);

        //init tools
        let newGif = {};
        const gifsArr = [];
        if (gifDB[0] === undefined) 
        {
          console.log('no gifs in the DB creating entries for the gifs in the DB');
          //create gifs if not exist
          //MAKE FOR LOOP TO LOOP THROUGH
          // API SEARCH RESULTS
          for (
            let i = 0; 
            i < gifJson.data.length;
            i++
          )
          {
            newGif = {
              gifSrc: gifJson.data[i].images.original.url,
              gifCategory: userUrlSearchTerm || altTerm,
              limit: '10' 
            }
            //push onto array to return
            gifsArr.push(newGif);
          }
          const newGifs = await Gif.insertMany(gifsArr);
          //console.log(newGifs);
          return newGifs;
        } 
        //else if gifs exist in db update db with newest search results
        else if (gifDB[0]._id) 
        {
          console.log("collection exists already");
          // exists already, delete it and make a new one
          // with the new search terms
          console.log("deleting...");
          await Gif.deleteMany();
          //creating new with given new api info
          for(
            let i = 0;
            i < gifJson.data.length;
            i++
          )
          {
            newGif = {
              gifSrc: gifJson.data[i].images.original.url,
              gifCategory: userUrlSearchTerm || altTerm,
              limit: '10' 
            }

            gifsArr.push(newGif);
          }
          const updatedGifs = await Gif.insertMany(gifsArr);
          console.log("updatedgifs...");
          //console.log(updatedGifs);
          console.log("updatedgifs...");
          return updatedGifs;
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  Mutation: {
    addSearchTerm: async (parent, args, context) => {
      console.log('adding the search term test');
      const newSearchTerm = await SearchTerm.create(args);
      return newSearchTerm;
    },
    addUser: async (parent, args, context) => {
      const user = await User.create(args);
      const token = signToken({
        username: user.username,
        email: user.email,
        _id: user._id
      });

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      //console.log(context.user);
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate
        (
          context.user._id, 
          { 
            $push: { 
              orders: order 
            } 
          }
        );

        return order;
      } else {
        throw new AuthenticationError('Not logged in');
      }
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      } else {
        throw new AuthenticationError('Not logged in');
      }
    },
    /**
     * ADD PRESET STRING NAME MUTATION
     * @params {Object} parent
     * @params {Object} arguments arguments made by the query to represent variables in the mutation function
     * @params {Object} context Object which contains the user information tokens and such...not sure yet
    */
    addUserPreset: async (
      parent, 
      args, 
      context
    ) => {
      // console.log('ARGS!');
      // console.log(args);
      //find logged in user by context._id
      if (context.user) {
        //console.log(context.user);

        //check if the User has the preset already to not add duplicate objects to the presets array
        const userInfo = await User.findById(context.user._id);
        console.log(userInfo);
        for (let i = 0; i < userInfo.presets.length; i++) 
        {
          if (userInfo.presets[i].presetName.includes(args.presetName))
          {
            // console.log('preset already added.');
            throw new Error("That preset is already added.");
          }
        }

        const updatedUser = await User.findByIdAndUpdate
        (
          context.user._id,
          {
            $push: {
              presets: {//input args from front end graphql query
                presetName: args.presetName
              }
            }
          },
          {new: true}
        );
        console.log(updatedUser);
        return updatedUser;
      } else {
        throw new AuthenticationError("Must be logged in to do that.");
      }
    },
    updateUserDefaultPreset: async (
      parent,
      args,
      context
    ) => {
      //console.log(args);
      if (context.user) {
        const user = await User.findByIdAndUpdate
        (
          context.user._id,
          {
            $set: {
              defaultPreset: args
            }
          },
          {new: true}
        );
        return user;
      } else {
        throw new AuthenticationError("Must be logged in to do that.");
      }
    },
    updateUserSearchTerm: async (parent, args, context) => {
      if (context.user) {
        //get user searchTerm
        const updatedUser = await User.findByIdAndUpdate
        (
          context.user._id,
          {
            //set user.searchTerm to the searchtime found by ID
            $set: {
              userSearchTerm: args.userSearchTerm
            }
          }, 
          { new: true }
        );
        console.log(updatedUser);
        return updatedUser;

      }
    },
    updateProduct: async (
      parent,
       {/**variable input args to change database!!! *///update??but in here we're decrementing?? okay... 
         _id, 
         quantity 
      }) => 
    {
      const decrement = Math.abs(quantity) * -1;

      const user = await Product.findByIdAndUpdate(_id, 
        { 
          $inc: 
          { 
            quantity: decrement 
          } 
        }, 
        { new: true }
      );
      console.log(user);
      return user;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    /**
     * 
     * @param {unknown} parent dont remember what this is
     * @param {{email: string}} args args sent by the client mutation hook
     * @param {unknown} context dont remember what this is either
     * @returns {{done: boolean} | { error: { field: string, message: string } }} 
     */
    forgotPassword: async (parent, { email }, context) => {
      try {
        
        //find the user first in the db, if can't be found just dont do anything and return done
        const users = await User.find({ email });
        // console.log("found users with email arg", users);
        //return if theres no user to not send an email to a user int he database that dones't have that email
        if (!users.length) return {
          done: true,
          error: null
        }
      
        // console.log("what is context", context);
        const resetToken = uuid.v4();
        
        //sign a new token with some uuid and a new expiration
        const token = signToken({
          uuid: resetToken,
          resetEmail: email,
          exp: "5m"
        });
        //send to the email sent in the args include a link in the email with the token in the URL params
        // for both dev and prod domains
  
        const sendEmailArgs = {
          fromHeader: "Password Reset",
          subject: "Password Reset Request",
          mailTo: email,
          mailHtml:  `
            <span>We were made aware that you request your password to be reset</span>
            <p>If this wasn't you. Then please disregard this email. Thank you!</p>
            <h2>This Request will expire after 5 minutes.</h2>
            <a href="${APP_DOMAIN_PREFIX}/changePassword/${token}">Reset your password</a>   
          `
        }
  
        // console.log("sending this as args", sendEmailArgs);
  
        await sendEmail(sendEmailArgs);
        
        
        return {
          done: true,
          error: null
        };
      } catch (error) {
        return {
          error: {
            field: "error with forgot pass request",
            message: error.message
          }
        }
      }

    },
    /**
     * 
     * @param {unknown} parent dunno yet
     * @param {{token: string, password: string}} args args passed for a change password request
     * @param {unknown} context no idea what this is
     * @returns {{done: boolean} | { error: { field: string, message: string } }} ChangePasswordResponse
     */
    changePassword: async (parent, args, context) => {
      try {

        const {
          token,
          password
        } = args;

        //verify the token first for expiration
        const decoded = await verifyAsync(token);
        if (/invalid/g.test(decoded)) {
          throw new AuthenticationError("invalid token");
        }
        if (/expired/g.test(decoded)) {
          throw new AuthenticationError("expired token");
        }

        //decode the token to get the user from the email signed into the token
        // const decoded = decodeToken(token);
        if (!decoded) throw new AuthenticationError("invalid token");

        // console.log("what is decoded token", decoded);
        // get the user based on the email from the decoded token
  
        //update the user table with the new hashed password
        // const user = await User.findOne({ email: new RegExp(`${decoded.resetEmail}`, "g") });
        // console.log("did we find a user from the email passwed in the token", user);

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

        const filter = { email: decoded.resetEmail };
        const update = { password: hashedPassword };
        const updatedUser = await User.findOneAndUpdate(filter, update, {
          new: true
        });

        const newToken = signToken({
          username: updatedUser.username,
          email: updatedUser.email,
          _id: updatedUser._id
        });

        return {
          done: true,
          token: newToken
        }
      } catch (error) {
        return {
          error: {
            field: "change pass error",
            message: error.message
          }
        };
      }
    }
  }
};

module.exports = resolvers;