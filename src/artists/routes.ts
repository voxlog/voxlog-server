import { Router } from 'express';
import * as Artist from './handler';

const routes = Router();
routes.get('/search', Artist.searchByName);
routes.get('/popular', Artist.getPopular);
routes.get('/:artistId/listening-stats', Artist.getListeningStats);
routes.get('/:artistId', Artist.getById);
export default routes;
