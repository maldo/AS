var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../config/config');

var UserResourceSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	resources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }]
});

UserResourceSchema.index({ user: 1, client:1 }, {unique: true});
mongoose.model('UserResource', UserResourceSchema);

module.exports = mongoose.model('UserResource');