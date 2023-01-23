import 'dotenv/config';
import express from 'express';
import scrobblesRoutes from './scrobbles/routes';
import userRoutes from './users/routes';
import trackRoutes from './tracks/routes';
import albumRoutes from './albums/routes';
import artistRoutes from './artists/routes';
import eventsRoutes from './events/routes';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log('Request: ', req.method, req.path, '\nbody:', req.body);
  next();
});
app.use(cors());

app.use('/scrobbles', scrobblesRoutes);
app.use('/users', userRoutes);
app.use('/tracks', trackRoutes);
app.use('/albums', albumRoutes);
app.use('/artists', artistRoutes);
app.use('/events', eventsRoutes);

// serve static images
app.use('/images', express.static('images'));
// route to upload images
// app.post('/images', (req, res) => {
//   // store image in images folder

//   // return image url
//   res.send('image url');
// });

app.listen(8000);
