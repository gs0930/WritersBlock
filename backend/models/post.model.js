const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  content: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  // comments: [
  //   {
  //     type: String, //mongoose.Schema.Types.ObjectId
  //     // ref: 'Comment',
  //   },
  // ], 
  comments:  
    {
      type: String, //mongoose.Schema.Types.ObjectId
      // ref: 'Comment',
    }
  ,

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
