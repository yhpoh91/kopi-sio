import axios from 'axios';

const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

const getOAuthUrl = () => {
  const state = 'teststate';
  const redirectUri = `${publicHost}/oauth/facebook/redirect`;
  const clientId = process.env.OAUTH_FACEBOOK_CLIENT_ID;
  const scope = (process.env.OAUTH_FACEBOOK_SCOPE || '').replace(/,/g, ' ');
  const rerequest = (process.env.OAUTH_FACEBOOK_REREQUEST || 'false').toLowerCase() === 'true';

  let url = `https://www.facebook.com/v7.0/dialog/oauth?state=${state}&redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scope}`;

  if (rerequest) {
    url += `&auth_type=rerequest`;
  }

  return url;
};

const getToken = async (code) => {
  const clientId = process.env.OAUTH_FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.OAUTH_FACEBOOK_CLIENT_SECRET;
  const redirectUri = `${publicHost}/oauth/facebook/redirect`;

  const url = `https://graph.facebook.com/v7.0/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`;
  const response = await axios.get(url);
  const { data } = response;

  console.log(data);
  return Promise.resolve(data);
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
