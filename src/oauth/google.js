import express from 'express';

import oauthService from '../services/oauth';

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.redirect(oauthService.google.getOAuthUrl()));
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

export default router;
