var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var config = require('../config/config');

var ResourceSchema = new Schema({

	rsid: String,
	etag: String,
	privacy: String,
	uid: { type: String, unique: true },
	access: [{ type: Schema.Types.ObjectId, ref: 'Access' }],
	desc: { name : String,
			icon_uri : String,
			scopes : [String]
		}
});

ResourceSchema.statics.generateUid = function () {
	return crypto.randomBytes(8).toString('hex');
};

ResourceSchema.index({ uid: 1 }, {unique: true});
mongoose.model('Resource', ResourceSchema);

module.exports = mongoose.model('Resource');