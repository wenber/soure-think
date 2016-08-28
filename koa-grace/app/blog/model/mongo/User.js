'use strict';

// model名称，即表名
exports.model = 'User';

// 表结构
exports.schema = [{
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  isAuthor: {type: Boolean,'default': false},
  isAdmin: {type: Boolean,'default': false},
  nickname: {type: String,required: true},
  avatar: {type: String,required: true},
  github: {type: String,required: true},
  email: {type: String},
  blog: {type: String}
}, {
  autoIndex: true,
  versionKey: false
}];

// 静态方法:http://mongoosejs.com/docs/guide.html#statics
exports.statics = {}

// http://mongoosejs.com/docs/guide.html#methods
exports.methods = {
  add: function*() {
    return this.save();
  },
  deleteUser : function* (id) {
    let user = yield this.model('User').findOne({id:id});

    if(user){
      yield this.model('User').remove({id:id});
    }

    return user;
  },
  edit: function*() {
    let id = this.id;

    function getData(data) {
      let result = {};
      for (let item in data) {
        if (data.hasOwnProperty(item) && item !== '_id') {
          result[item] = data[item];
        }
      }
      return result;
    }

    if (this.isAuthor !== undefined) {
      return this.model('User').update({id: id}, {isAuthor: this.isAuthor});
    } else {
      return this.model('User').update({id: id}, getData(this._doc));
    }
  },
  getUserById: function*(id) {
    return this.model('User').findOne({
      id: id
    });
  },
  getAuthor: function*() {
    return this.model('User').find({
      isAuthor: true
    });
  },
  list: function*() {
    return this.model('User').find();
  }
}