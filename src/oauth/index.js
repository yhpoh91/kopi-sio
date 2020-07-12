import express from 'express';

import facebook from './facebook';
import google from './google';

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.send('You have reached the Oauth Router'));
router.use('/facebook', facebook);
router.use('/google', google);

export default router;
