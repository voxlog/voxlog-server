import { Router } from 'express';
import * as User from './handler';
import { UserCreateInSchema, UserLoginInSchema } from './dtos';
import { validateBody } from '../middlewares/dto';
import auth from '../middlewares/auth';

const routes = Router();
const userRoutes = Router({ mergeParams: true });

// users/
routes.post('/auth', validateBody(UserLoginInSchema), User.login);
routes.post('/', validateBody(UserCreateInSchema), User.create);
routes.get('/current', auth, User.getCurrent);
routes.get('/search', auth, User.searchByName);
routes.use('/:username', userRoutes);

// /users/:username
userRoutes.get('/', User.get);
userRoutes.get('/stats', User.getStats);
userRoutes.get('/recent-scrobbles', User.getRecentScrobbles);

export default routes;
