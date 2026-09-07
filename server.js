import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

dotenv.config();

const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const port = process.env.PORT || 3000;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'src/views'));

app.use(express.static(path.join(dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', {
      title: 'Our Partner Organizations',
      organizations
    });
  } catch (error) {
    console.error('Failed to load organizations:', error);
    res.status(500).send('Server Error loading organizations');
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render('projects', {
      title: 'Service Projects',
      projects
    });
  } catch (error) {
    console.error('Failed to load projects:', error);
    res.status(500).send('Server Error loading projects');
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', {
      title: 'Service Categories',
      categories
    });
  } catch (error) {
    console.error('Failed to load categories:', error);
    res.status(500).send('Server Error loading categories');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${nodeEnv}`);
});
