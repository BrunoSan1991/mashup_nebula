import enigma from 'enigma.js';

export default function connectLocal({ url, appId }) {
  const loadSchema = () =>
    fetch('https://unpkg.com/enigma.js/schemas/12.612.0.json').then((response) => response.json());

  const createConnection = () =>
    loadSchema().then((schema) => {
      // Corrigir o protocolo da URL para WebSocket e remover barra extra
      let wsUrl = url.replace(/^http/, 'ws').replace(/\/$/, '');

      return enigma
        .create({
          schema,
          url: `${wsUrl}/app/${encodeURIComponent(appId)}`,
        })
        .open()
        .then((qix) => qix.openDoc(appId));
    });

  return createConnection().then((app) => app);
}
