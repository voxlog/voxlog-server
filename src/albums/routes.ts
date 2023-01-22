import { Router } from 'express';
import * as Album from './handler';

const routes = Router();

routes.get('/:albumId', Album.getById);
routes.get('/search', Album.searchByName);
routes.get('/popular', Album.getPopular);
routes.get('/:albumId/listening-stats', Album.getListeningStats);
export default routes;
