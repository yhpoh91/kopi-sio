import axios from 'axios';
import loggerService from '../logger';

const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

const { L } = loggerService('Facebook Oauth Service');

const getOAuthUrl = () => {
  const state = 'teststate';
  const redirectUri = `${publicHost}/oauth/phone/redirect`;

  return `${publicHost}/phoneLogin.html?state=${state}&redirect_uri=${redirectUri}`;
};

const getToken = async (code, state) => {
  try {
    const tokenUrl = `${publicHost}/oauth/phone/token?code=${code}`;
    const tokenResponse = await axios.get(tokenUrl);
    const { data: tokenData } = tokenResponse;
    const mappedTokenData = {
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
    };
    return Promise.resolve(null);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  getOAuthUrl,
  getToken,
};
