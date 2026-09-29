import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './src/routes.js';
import flash from './src/middleware/flash.js';
import { testConnection } from './src/models/db.js';

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback_secret_key_987654321';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Session Management
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

// Flash Messages
app.use(flash);

// Form and JSON Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files & View Engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Logging in Development
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Pass Auth State and Environment to all EJS Views
app.use((req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session && req.session.user);
  res.locals.user = req.session ? req.session.user || null : null;
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Mount Routes
app.use(router);

// 404 Handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  if (err.stack) console.error('Stack trace:', err.stack);

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  res.status(status).render(`errors/${template}`, {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack
  });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Database connection error:', error);
  }
});
