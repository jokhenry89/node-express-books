var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },

  review: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  genre: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre'
  }],
  vocabulary: [{
    type: Schema.Types.ObjectId,
    ref: 'Vocabulary'
  }]
});

// Virtual for book's URL
BookSchema
  .virtual('url')
  .get(function () {
    return '/catalog/book/' + this._id;
  });

//Export model 
module.exports = mongoose.model('Book', BookSchema);