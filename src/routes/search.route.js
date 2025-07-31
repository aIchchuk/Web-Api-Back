// routes/search.routes.js

import { Router } from 'express';
import { getSuggestions } from '../controller/search.controller.js';

const router = Router();

router.get('/suggestions', getSuggestions);

export default router;
