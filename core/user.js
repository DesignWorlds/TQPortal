/**
 * user.js
 * This is the authentication user, not the topic user
 */
var bcrypt   = require('bcryptjs')
  , SALT_WORK_FACTOR = 10;

var User = module.exports = function(json) {
	console.log("NEWUSER "+json);
  var data;
  if (!json)
    data  = {};
  else {
    data = json;
    if (data.email)
      data._id = data.email;
  }
  console.log('NEWUSER-1 '+JSON.stringify(data));
  var self = this;
  
  self.getData = function() {
	  return data;
  },
  self.setEmail = function(email) {
    data['email'] = email;
    data._id = email;
  },
  self.getEmail = function() {
    return data['email'];
  },
  self.setHandle = function(handle) {
    data['handle'] = handle;
  },
  self.getHandle = function() {
    return data['handle'];
  },
  self.setFullName = function(fullName) {
    data['fullname'] = fullName;
  },
  self.getFullName = function() {
    return data['fullname'];
  },
  self.setHomepage = function(homePage) {
    this.data['homePage'] = homePage;
  },
  self.getHomepage = function() {
    return data['homePage'];
  },
  self.setAvatar = function(avatar) {
    data['avatar'] = avatar;
  },
  self.getAvatar = function() {
    return data['avatar'];
  },
  /**
   * @param password text
   * @param callback: signature (err)
   */
  self.setPassword = function(password, callback) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if(err) return callback(err);
      bcrypt.hash(password, salt, function(err, hash) {
        if(err) return callback(err);
        data['password'] = hash;
        callback();
      });
    });
  },
  self.getPassword = function() {
    return data['password'];
  },
  self.addCredential = function(credential) {
    var lx =  data['credentials'];
    if (!lx) {lx = [];}
    lx.push(credential);
    data['credentials'] = lx;
  },
  self.listCredentials = function() {
    return data['credentials'];
  },
  self.hasCredential = function(credential) {
    var lx =  data['credentials'];
    if (!lx)
      return false;
    if (lx.indexOf(credential) > -1)
      return true;
    return false;
  },
  self.removeCredential = function(credential) {
    var lx =  data['credentials'];
    if (lx) {
      var index = lx.indexOf(credential);
      if (index > -1) {
        lx.splice(index,1);
        data['credentials'] = lx;
      }
    }
  },
  /**
   * @param candidatePassword
   * @param callback signature (err, isMatch)
   */
  self.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, data['password'], function(err, isMatch) {
      if(err) return callback(err, false);
      console.log('USER_COMPAREPWD '+isMatch);
      callback(null, isMatch);
    });
  }
};