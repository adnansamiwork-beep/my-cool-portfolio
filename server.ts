import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

import { INITIAL_PORTFOLIO_DATA, INITIAL_ANALYTICS_DATA } from './src/data';

const PORT = 3000;
const CONFIG_FILE = path.join(process.cwd(), 'firebase-applet-config.json');

let dbInstance: any = null;

function getDb() {
  if (!dbInstance) {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      const firebaseApp = initializeApp(config);
      dbInstance = getFirestore(firebaseApp, config.firestoreDatabaseId);
    } else {
      throw new Error('firebase-applet-config.json not found');
    }
  }
  return dbInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get('/api/portfolio', async (req, res) => {
    try {
      const db = getDb();
      const docRef = doc(db, 'portfolio', 'sami');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        res.json(docSnap.data());
      } else {
        // Bootstrap initial database values to the cloud
        await setDoc(docRef, INITIAL_PORTFOLIO_DATA);
        res.json(INITIAL_PORTFOLIO_DATA);
      }
    } catch (e) {
      console.error('Error reading portfolio data from Firestore', e);
      res.status(500).json({ error: 'Failed to read portfolio data from Firestore' });
    }
  });

  app.post('/api/portfolio', async (req, res) => {
    try {
      const updatedData = req.body;
      if (!updatedData || !updatedData.profile) {
        return res.status(400).json({ error: 'Invalid portfolio data structure' });
      }
      const db = getDb();
      const docRef = doc(db, 'portfolio', 'sami');
      await setDoc(docRef, updatedData);
      res.json({ message: 'Success', data: updatedData });
    } catch (e) {
      console.error('Error writing portfolio data to Firestore', e);
      res.status(500).json({ error: 'Failed to write portfolio data to Firestore' });
    }
  });

  app.get('/api/analytics', async (req, res) => {
    try {
      const db = getDb();
      const docRef = doc(db, 'analytics', 'sami');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        res.json(docSnap.data());
      } else {
        // Bootstrap initial database values to the cloud
        await setDoc(docRef, INITIAL_ANALYTICS_DATA);
        res.json(INITIAL_ANALYTICS_DATA);
      }
    } catch (e) {
      console.error('Error reading analytics data from Firestore', e);
      res.status(500).json({ error: 'Failed to read analytics from Firestore' });
    }
  });

  app.post('/api/analytics', async (req, res) => {
    try {
      const data = req.body;
      const db = getDb();
      const docRef = doc(db, 'analytics', 'sami');
      await setDoc(docRef, data);
      res.json({ message: 'Success' });
    } catch (e) {
      console.error('Error writing analytics data to Firestore', e);
      res.status(500).json({ error: 'Failed to write analytics to Firestore' });
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

