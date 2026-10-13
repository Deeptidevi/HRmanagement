const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors());

// Parse incoming JSON, text, and URL-encoded requests
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: ['text/plain', 'application/javascript', 'text/*'] }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes under /api
app.use('/api', apiRoutes);

// Serve Static Frontend Assets (React Build or Root)
const rootDir = path.join(__dirname, '..');
const clientDist = path.join(rootDir, 'client', 'dist');
const fs = require('fs');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.json({
      status: 'ONLINE',
      system: 'AmaHR Enterprise HRMS (PERN Architecture)',
      backend: 'Express.js & Node.js on port ' + PORT,
      database: 'PostgreSQL (' + (process.env.PG_DATABASE || 'hrms_db') + ')',
      frontend: 'React (Vite) at http://localhost:3000 ("npm run client")',
      productionBuild: 'Run "npm run build" to build React into client/dist'
    });
  });
}

// Start Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 AmaHR Enterprise HRMS Server (PERN Stack)`);
  console.log(`🌐 Application URL: http://localhost:${PORT}`);
  console.log(`🔌 REST API Base:   http://localhost:${PORT}/api`);
  console.log(`📦 Database:        PostgreSQL (${process.env.PG_DATABASE || 'hrms_db'})`);
  console.log(`====================================================`);
});

module.exports = app;
