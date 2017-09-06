const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})


//pre是每次调用save方法都执行这个方法体
UserSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

//添加静态方法
UserSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	fetchById:function(id,cb){
		return this.findOne({_id:id}).exec(cb)
	},
	fetchByName: function(username, cb) {
		return this
			.findOne({
				username: username
			})
			.exec(cb)
	}

}


//给其他地方调用提供了接口
module.exports = UserSchema