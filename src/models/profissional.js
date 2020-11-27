const mongoose = require('../database');
const FuncSchema = new mongoose.Schema({
	nome:{
		type:String,
		require:true
	},
	funcao:{
		type:String,
		require:true
	},
	cpf:{
		type:String,
		require:true
	},
	rg:{
		type:String,
		require:true
	},
	idade:{
		type:String,
		require:true
	},
	endereco:{
		type:String,
		require:true
	},
	telefone:{
		type:String,
		require:true
	},
	especialidade:{
		type:String,
		require:true
	},
	estado_civil:{
		type:String,
		require:true
	},
	email:{
		type:String,
		required:true,
		unique:true,
		lowercase:true
	},
	login:{
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