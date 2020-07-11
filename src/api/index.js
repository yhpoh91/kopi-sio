import express from 'express';

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.send('You have reached the API Router'));

export default router;
