import { embed } from '@nebula.js/stardust';

import barchart from '@nebula.js/sn-bar-chart';
import piechart from '@nebula.js/sn-pie-chart';  // Importando o gráfico de pizza

const n = embed.createConfiguration({
  context: {
    theme: 'light',
    language: 'en-US',
  },
  types: [
    {
      name: 'barchart',
      load: () => Promise.resolve(barchart),
    },
    {
      name: 'piechart',
      load: () => Promise.resolve(piechart),  // Registrando o gráfico de pizza
    },
  ],
});

export default n;
