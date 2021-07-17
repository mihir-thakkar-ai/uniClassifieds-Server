const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  itemName: String,
  img: [String],
  sellingPrice: Number,
  negotiable: Boolean,
  username: String,
  createdAt: String,
  interestedUsers: [
    {
      email: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
