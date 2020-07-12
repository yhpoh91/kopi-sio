import axios from 'axios';

const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

const getOAuthUrl = () => {
  const state = 'teststate';
  const redirectUri = `${publicHost}/oauth/facebook/redirect`;
  const clientId = process.env.OAUTH_FACEBOOK_CLIENT_ID;
  return `https://www.facebook.com/v7.0/dialog/oauth?state=${state}&redirect_uri=${redirectUri}&client_id=${clientId}`;
};

const getToken = async (code) => {
  const clientId = process.env.OAUTH_FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.OAUTH_FACEBOOK_CLIENT_SECRET;
  return Promise.reject(new Error('not implemented yet'));
};

const deleteData = async () => {
  console.log('Facebook Delete Data request detected');
  return Promise.resolve();
};

const deauthorize = async () => {
  console.log('Facebook Deauthorizae callback detected');
  return Promise.resolve();
};

export default {
  getOAuthUrl,
  getToken,

  deleteData,
  deauthorize,
};
