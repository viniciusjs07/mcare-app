const mongoose = require('../database');
const FuncSchema = new mongoose.Schema({
	nome:{
		type:String,
		require:true
	},
	email:{
		type:String,
		required:true,
		unique:true,
		lowercase:true
	},
	senha:{
		type:String,
		required:true,
		select:false
	},
	createdAt:{
		type:Date,
		default:Date.now
	}

});

const Funcionario = mongoose.model('Funcionario', FuncSchema);
module.exports = Funcionario;

