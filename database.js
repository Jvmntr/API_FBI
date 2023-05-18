const mongoose = require('mongoose');

require('dotenv').config();

const dbPassWord = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassWord}@${dbName}.fx2swr0.mongodb.net/`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conexão com o MongoDB estabelecida com sucesso!');
}).catch(error => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

const mostWantedSchema = new mongoose.Schema({
  nome: String,
  foto: String,
  idade: {
    type: mongoose.Schema.Types.Mixed,
    default: 'não informado pela API'
  },
  apelidos: [String],
  details: String,
  remarks: String,
  assuntos: [String],
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

const MostWanted = mongoose.model('MostWanted', mostWantedSchema);

module.exports = MostWanted;