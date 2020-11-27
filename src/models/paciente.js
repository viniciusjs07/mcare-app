const mongoose = require('../database');
const PacienteSchema = new mongoose.Schema({
	nome:{
		type:String,
		require:true
	},
	sexo:{
		type:String,
		require:true
	},
	data_nascimento:{
		type:Date,
		require:true
	},
	endereco:{
		type:String,
		require:true
	},
	cidade:{
		type:String,
		require:true
	},
	telefone:{
		type:String,
		require:true
	},
	createdAt:{
		type:Date,
		default:Date.now
	}

});

const Paciente = mongoose.model('Paciente', PacienteSchema);
module.exports = Paciente;
