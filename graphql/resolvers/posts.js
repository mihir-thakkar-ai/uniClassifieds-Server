const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(
      _,
      { body, itemName, img, sellingPrice, negotiable },
      context
    ) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }
      const newPost = new Post({
        body,
        user: user.id,
        email: user.email,
        itemName,
        sellingPrice,
        img,
        negotiable,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if(!post) throw new Error("Post not found");
        if (user.id === post.user) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async conveyInterest(_, { postId }, context) {
      let returnMessage = "Interest conveyed to the seller";
      const { id, email } = checkAuth(context);
      const post = await Post.findById(postId);
      if (!post) throw new Error("Sorry, this post no longer exists..");

      if (post.user === id) {
        throw new Error("You cannot convey interest on your own post");
      }

      if (post) {
        if (post.interestedUsers.find((like) => like.email === email)) {
          // Post already liked, unlike it.
          post.interestedUsers = post.interestedUsers.filter(
            (like) => like.email !== email
          );
          returnMessage = "Interest uncoveyed.";
        } else {
          // Not liked, like it
          post.interestedUsers.push({
            email,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return returnMessage;
      } else throw new UserInputError("Post not found");
    },
  },
};
