const express = require('express');
const MostWanted = require('./database.js');
const fetchMostWantedData = require('./api.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Definições de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Most Wanted',
      version: '1.0.0',
      description: 'API para consultar os mais procurados do FBI',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: ['server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     MostWanted:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         foto:
 *           type: string
 *         idade:
 *           type: string
 *         apelidos:
 *           type: array
 *           items:
 *             type: string
 *         details:
 *           type: string
 *         remarks:
 *           type: string
 *         assuntos:
 *           type: array
 *           items:
 *             type: string
 *     MostWantedList:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MostWanted'
 *     WantedNames:
 *       type: object
 *       properties:
 *         wantedNames:
 *           type: array
 *           items:
 *             type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /most-wanted:
 *   get:
 *     summary: Obtém a lista dos mais procurados
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista dos mais procurados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MostWantedList'
 *       '500':
 *         description: Falha ao obter a lista de mais procurados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/most-wanted', async (req, res) => {
  try {
    const items = await MostWanted.find().limit(200).exec();
    res.json({ items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Falha ao obter a lista de mais procurados' });
  }
});

/**
 * @swagger
 * /most-wanted/search:
 *   get:
 *     summary: Pesquisa por nomes de procurados
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do procurado a ser pesquisado.
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna os nomes dos procurados correspondentes à pesquisa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WantedNames'
 *       '500':
 *         description: Falha ao buscar por nomes de procurados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/most-wanted/search', async (req, res) => {
  const { name } = req.query;
  try {
    const regex = new RegExp(name, 'i');
    const items = await MostWanted.find({ nome: { $regex: regex } }).limit(200).exec();
    res.json({ items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Falha ao buscar por nomes de procurados' });
  }
});

app.listen(3000, async () => {
  console.log('Servidor em execução na porta 3000');
  await fetchMostWantedData(); // Chama a função para buscar e salvar os dados no banco
});