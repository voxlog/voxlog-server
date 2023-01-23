import { Router } from 'express';
import auth from '../middlewares/auth';
import * as Events from './handler';
const routes = Router();

routes.post('/', auth, Events.create);
// routes.get('/', auth, Events.getAll);
// routes.get('/:id', auth, Events.get);

export default routes;
