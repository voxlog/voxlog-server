import { Router } from 'express';
import auth from '../middlewares/auth';
import * as Events from './handler';
const routes = Router();

routes.post('/', auth, Events.create);
routes.get('/', Events.getAll);
routes.post('/:id/attend', auth, Events.attend);
routes.get('/:id', Events.get);

export default routes;
