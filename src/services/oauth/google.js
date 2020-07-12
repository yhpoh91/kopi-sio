import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';

const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

const getOAuthUrl = () => {
  const state = 'teststate';
  const redirectUri = `${publicHost}/oauth/google/redirect`;
  const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
  const scope = (process.env.OAUTH_GOOGLE_SCOPE || '').replace(/,/g, ' ');
  const accessType = process.env.OAUTH_GOOGLE_ACCESS_TYPE || 'offline';
  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&state=${state}&redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scope}&access_type=${accessType}`;
};

const getToken = async (code, state) => {
  try {
    const redirectUri = `${publicHost}/oauth/google/redirect`;
    const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.OAUTH_GOOGLE_CLIENT_SECRET;
    const grantType = 'authorization_code';

    const url = 'https://oauth2.googleapis.com/token';
    const body = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: grantType,
    };
    const response = await axios.post(url, body);
    const { data: tokenData } = response;

    const mappedTokenData = {
      idToken: tokenData.id_token,
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      refreshToken: tokenData.refresh_token,
      scope: tokenData.scope,
      tokenType: tokenData.token_type,
    };

    const userData = jsonwebtoken.decode(mappedTokenData.idToken);
    const mappedUserData = {
      id: userData.sub,
      firstName: userData.given_name,
      lastName: userData.family_name,
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
    };

    const data = {
      token: mappedTokenData,
      user: mappedUserData,
    };
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export default {
  getOAuthUrl,
  getToken,
};
