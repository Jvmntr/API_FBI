const axios = require('axios');
const MostWanted = require('./database.js');

async function fetchMostWantedData() {
  try {
    const response = await axios.get('https://api.fbi.gov/wanted/v1/list', {
      params: {
        pageSize: 50
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    const data = response.data;
    const noData = 'não informado pela API';

    if (data && data.items && Array.isArray(data.items)) {
      const items = data.items.slice(0, 50).map(item => ({
        nome: item.title || noData,
        apelidos: item.aliases?.join(', ') || noData,
        foto: item.images?.[0]?.large || noData,
        idade: item.age_range || noData,
        details: item.details ? item.details.replace(/<\/?p>/gi, '') : noData,
        remarks: item.remarks ? item.remarks.replace(/<\/?p>/gi, '') : noData,
        assuntos: item.subjects || noData,
      }));

      const existingItems = await MostWanted.find().lean();
      const existingNames = existingItems.map(item => item.nome);
      const newItems = items.filter(item => !existingNames.includes(item.nome));

      if (newItems.length > 0) {
        await MostWanted.insertMany(newItems);
        console.log(`${newItems.length} novos itens salvos`);
      } else {
        console.log('Não há novos itens para salvar');
      }
    } else {
      console.log('Não foi possível obter os itens mais procurados do FBI');
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = fetchMostWantedData;