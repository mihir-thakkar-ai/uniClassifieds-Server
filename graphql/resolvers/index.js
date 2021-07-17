const postsResolvers = require("./posts");
const usersResolvers = require("./users");

module.exports = {
  Post: {
    interestCount: (parent) => parent.interestedUsers.length,
  },

  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
  
};
