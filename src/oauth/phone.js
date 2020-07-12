import express from 'express';
import path from 'path';

import loggerService from '../services/logger';
import oauthService from '../services/oauth';
import nexmoService from '../services/nexmo';

const { L } = loggerService('Phone Oauth Router');

const isHeroku = (process.env.IS_HEROKU || 'false').toLowerCase() === 'true';
const publicHost = isHeroku ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : process.env.PUBLIC_HOST;

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.redirect(oauthService.phone.getOAuthUrl()));

router.get('/redirect', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (code == null) {
      // Initial response to Oauth
      res.send();
      return;
    }
  
    // Final response to User
    const token = await oauthService.google.getToken(code, state);
    res.json(token);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { number, state, redirectUri } = req.body;
  
    // Submit Verify Request
    const result = await nexmoService.verify.request(number);
    if (result.ok) {
      const { requestId } = result;
      res.redirect(`${publicHost}/phoneVerify.html?number=${number}&request_id=${requestId}&state=${state}&redirect_uri=${redirectUri}`);
      return;
    }
  
    res.redirect(`${publicHost}/phoneLogin.html?state=${state}&redirect_uri=${redirectUri}&error=${result.errorText}`);
  } catch (error) {
    next(error);
  }
});

router.post('/verify', async (req, res) => {
  try {
    console.log(req.body);
    const {
      number, code, state, redirectUri, requestId,
    } = req.body;

    // Submit Verify Check
    const result = await nexmoService.verify.check(requestId, code);
    if (result.ok) {
      res.redirect(`${publicHost}/phoneSetup.html?number=${number}&state=${state}&redirect_uri=${redirectUri}`);
      return;
    }

    L.error(`Error (${requestId}): ${result.errorText}`);
    res.redirect(`${publicHost}/phoneVerify.html?number=${number}&request_id=${requestId}&state=${state}&redirect_uri=${redirectUri}&error=${result.errorText}`);
  } catch (error) {
    next(error);
  }
})

router.get('/token', (req, res) => {
  const { code } = req.query;

  if (code === 'MeowIsTheOneTrueMeow') {
    res.status(200).json({
      access_token: "meow",
      token_type: "bearer",
      expiresIn: 3600000,
    });
    return;
  }

  res.status(401).send('unauthenticated');
});

export default router;
