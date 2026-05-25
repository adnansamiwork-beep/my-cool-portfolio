import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import { INITIAL_PORTFOLIO_DATA, INITIAL_ANALYTICS_DATA } from './src/data';

const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'sami-portfolio-data.json');
const ANALYTICS_FILE = path.join(process.cwd(), 'sami-analytics-data.json');

// Initialize store files
function setupStoreFiles() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_PORTFOLIO_DATA, null, 2), 'utf8');
  }
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(INITIAL_ANALYTICS_DATA, null, 2), 'utf8');
  }
}

async function startServer() {
  setupStoreFiles();
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/portfolio', (req, res) => {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch (e) {
      console.error('Error reading portfolio data', e);
      res.status(500).json({ error: 'Failed to read portfolio data' });
    }
  });

  app.post('/api/portfolio', (req, res) => {
    try {
      const updatedData = req.body;
      if (!updatedData || !updatedData.profile) {
        return res.status(400).json({ error: 'Invalid portfolio data structure' });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2), 'utf8');
      res.json({ message: 'Success', data: updatedData });
    } catch (e) {
      console.error('Error writing portfolio data', e);
      res.status(500).json({ error: 'Failed to write portfolio data' });
    }
  });

  app.get('/api/analytics', (req, res) => {
    try {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf8');
      res.json(JSON.parse(data));
    } catch (e) {
      console.error('Error reading analytics data', e);
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/analytics', (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf8');
      res.json({ message: 'Success' });
    } catch (e) {
      console.error('Error writing analytics data', e);
      res.status(500).json({ error: 'Failed' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
