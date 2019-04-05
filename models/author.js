var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var moment = require('moment');

var AuthorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100
  },
  family_name: {
    type: String,
    required: true,
    max: 100
  },
  date_of_birth: {
    type: Date
  },
  date_of_death: {
    type: Date
  },
});

// Virtual for author's full name
AuthorSchema
  .virtual('name')
  .get(function () {
    return this.family_name + ', ' + this.first_name;
  });

// Virtual for author's lifespan
AuthorSchema
  .virtual('lifespan')

  .get(function () {
    let lifetime = '';
    if (this.date_of_birth) {
      lifetime = moment(this.date_of_birth).format('MMMM Do, YYYY');
    }
    lifetime += ' ';
    if (this.date_of_death) {
      lifetime += moment(this.date_of_death).format('MMMM Do, YYYY');
    }
    return lifetime;
  });

// Virtual for author's URL
AuthorSchema
  .virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id;
  });

//Export model
module.exports = mongoose.model('Author', AuthorSchema);