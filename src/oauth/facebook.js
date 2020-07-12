import express from 'express';

import oauthService from '../services/oauth';

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.redirect(oauthService.facebook.getOAuthUrl()));
router.get('/redirect', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (code == null) {
      // Initial response to Oauth
      res.send();
      return;
    }
  
    // Final response to User
    const token = await oauthService.facebook.getToken(code, state);
    res.json(token);
  } catch (error) {
    next(error);
  }
});

router.get('/deleteData', async (req, res) => {
  try {
    await oauthService.facebook.deleteData(req.query);
    res.send();
  } catch (error) {
    next(error);
  }
});

router.get('/deauthorize', async (req, res) => {
  try {
    await oauthService.facebook.deauthorize(req.query);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default router;
