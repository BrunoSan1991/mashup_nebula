import enigma from 'enigma.js';
import schema from 'enigma.js/schemas/12.2015.0.json';
import { Auth, AuthType } from '@qlik/sdk';

export default class Authenticator {
  /**
   * Construtor da classe Authenticator.
   * @param {Object} config - Configurações para autenticação.
   * @param {String} config.appId - ID da aplicação no Qlik Sense.
   * @param {String} config.url - URL do tenant do Qlik Sense.
   */
  constructor({ appId, url }) {
    this.authInstance = null;
    this.appId = appId;
    // Remove o protocolo e barras extras da URL para garantir que o host esteja limpo.
    this.host = url.replace(/^https?:\/\//, '').replace(/\/?/, '');
  }

  /**
   * Autentica usando o Web Integration ID e retorna uma instância do aplicativo Enigma.
   * @param {String} webIntegrationId - Web Integration ID do console de gerenciamento.
   * @returns {Promise<IEnigmaClass>} - Promessa de uma instância do aplicativo Enigma.
   */
  async authenticateWithWebIntegrationId({ webIntegrationId }) {
    this.authInstance = new Auth({
      authType: AuthType.WebIntegration,
      autoRedirect: true,
      host: this.host,
      webIntegrationId,
    });

    if (!this.authInstance.isAuthenticated()) {
      await this.authInstance.authenticate();
    }
    return this.getEnigmaApp();
  }

  /**
   * Autentica usando OAuth2 e retorna uma instância do aplicativo Enigma.
   * @param {String} clientId - Client ID do console de gerenciamento.
   * @param {String} redirectUri - URI de redirecionamento após a autenticação.
   * @returns {Promise<IEnigmaClass>} - Promessa de uma instância do aplicativo Enigma.
   */
  async authenticateWithOAuth({ clientId, redirectUri = window.location.origin }) {
    this.authInstance = new Auth({
      authType: AuthType.OAuth2,
      host: this.host,
      redirectUri,
      clientId,
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      try {
        await this.authInstance.authorize(window.location.href);
        const url = new URL(window.location);
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        window.history.replaceState(null, null, url);
      } catch (error) {
        console.error('Erro durante a autorização:', error);
        throw error;
      }
      return this.getEnigmaApp();
    }

    if (!(await this.authInstance.isAuthorized())) {
      const { url } = await this.authInstance.generateAuthorizationUrl();
      window.location.href = url; // Redireciona para a URL de autorização.
    }
    return null;
  }

  /**
   * Gera e retorna uma instância do aplicativo Enigma.
   * @returns {Promise<IEnigmaClass>} - Promessa de uma instância do aplicativo Enigma.
   */
  async getEnigmaApp() {
    const url = await this.authInstance.generateWebsocketUrl(this.appId);
    const enigmaGlobal = await enigma.create({ schema, url }).open();
    return enigmaGlobal.openDoc(this.appId);
  }
}