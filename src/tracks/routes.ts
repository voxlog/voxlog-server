import { Router } from 'express';
import * as Tracks from './handler';

const routes = Router();

routes.get('/search', Tracks.searchByName);
routes.get('/popular', Tracks.getPopular);
routes.get('/:trackId', Tracks.getById);
routes.get('/:trackId/listening-stats', Tracks.getListeningStats);
export default routes;
