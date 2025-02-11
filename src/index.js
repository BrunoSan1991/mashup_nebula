/* eslint-disable */
import embed from './configure';
import connect from './connect';

async function run() {
  try {
    const app = await connect({
      url: 'http://localhost:4848/',
      appId: 'Executive Dashboard.qvf',
    });

    const n = embed(app);

    const toolbarElement = document.querySelector('.toolbar');
    const objectElement = document.querySelector('.object');

    if (toolbarElement) {
      (await n.selections()).mount(toolbarElement);
    } else {
      console.error('Elemento .toolbar não encontrado.');
    }

    if (objectElement) {
      n.render({
        element: objectElement,
        id: 'ZxDKp',
      });
    } else {
      console.error('Elemento .object não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao conectar ou incorporar o aplicativo:', error);//vai corintians
  }
}

run();
