import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const port = process.env.PORT || 3000;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

// View engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'src/views'));

// Static assets middleware
app.use(express.static(path.join(dirname, 'public')));

// Application Routes
app.get('/', async (req, res) => {
  const pageTitle = 'Home';
  res.render('home', { title: pageTitle });
});

app.get('/organizations', async (req, res) => {
  const pageTitle = 'Our Partner Organizations';
  res.render('organizations', { title: pageTitle });
});

app.get('/projects', async (req, res) => {
  const pageTitle = 'Service Projects';
  res.render('projects', { title: pageTitle });
});

app.get('/categories', async (req, res) => {
  const pageTitle = 'Service Categories';
  res.render('categories', { title: pageTitle });
});

// Start listening
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${nodeEnv}`);
});
