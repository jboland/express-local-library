var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  }
);

// Virtual for author "full" name
AuthorSchema
.virtual('name')
.get(function () {
	return this.family_name + ', ' + this.first_name;
});

// Virtual for this author instance URL
AuthorSchema
.virtual('url')
.get(function () {
	return '/catalog/author/'+this._id;
});

// Virtual for this author instance URL
AuthorSchema
.virtual('lifespan')
.get(function () {
	var lifetime = '';
	if (this.date_of_birth) {
		lifetime = moment(this.date_of_birth).format('MMMM Do, YYYY') + ' - ';
	}
	
	if (this.date_of_death) {
		lifetime += moment(this.date_of_death).format('MMMM Do, YYYY');
	}
	return lifetime;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
