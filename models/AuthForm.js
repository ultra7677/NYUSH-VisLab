/**
 * Created by ultra on 7/25/16.
 */
var mongoose = require('mongoose');

var AuthSchema = new mongoose.Schema({
    username: String,
    password: String
});

mongoose.model('AuthForm', AuthSchema);