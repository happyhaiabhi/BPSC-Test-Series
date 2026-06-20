#!/usr/bin/env node
/**
 * BPSC Test Series - Simple Sync Backend
 * 
 * This is a minimal backend server for testing cross-device sync locally.
 * 
 * Usage:
 *   node sync-backend.js
 * 
 * Then configure app with endpoint: http://localhost:3000/sync
 */

const http = require('http');
const url = require('url');

// In-memory data store (replace with database in production)
const store = {};

// Parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : null);
      } catch(e) {
        reject(e);
      }
    });
  });
}

// Handle POST /sync
async function handlePost(req, res, data) {
  const { deviceId, dataKey, data: payload, timestamp } = data;
  
  console.log(`📤 POST from ${deviceId}: ${dataKey}`);
  
  if (!deviceId || !dataKey) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing deviceId or dataKey' }));
    return;
  }
  
  try {
    // Store data with timestamp
    if (!store[deviceId]) store[deviceId] = {};
    store[deviceId][dataKey] = { data: payload, timestamp };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      message: `Synced ${dataKey}`,
      timestamp
    }));
    
    console.log(`✅ Synced ${dataKey} for ${deviceId}`);
  } catch(err) {
    console.error('❌ Error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

// Handle GET /sync
function handleGet(req, res, query) {
  const deviceId = query.deviceId;
  
  console.log(`📥 GET from ${deviceId}`);
  
  if (!deviceId) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing deviceId' }));
    return;
  }
  
  try {
    const userData = store[deviceId] || {};
    const response = {
      history: userData.history?.data || [],
      mistakes: userData.mistakes?.data || {},
      bookmarks: userData.bookmarks?.data || {},
      skips: userData.skips?.data || {},
      archive: userData.archive?.data || {}
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
    
    console.log(`✅ Sent data for ${deviceId}`);
  } catch(err) {
    console.error('❌ Error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

// Main HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log(`\n[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);
  
  try {
    if (pathname === '/sync') {
      if (req.method === 'POST') {
        const body = await parseBody(req);
        await handlePost(req, res, body);
      } else if (req.method === 'GET') {
        handleGet(req, res, parsedUrl.query);
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
    } else if (pathname === '/debug') {
      // Debug endpoint to see all stored data
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        devices: Object.keys(store).length,
        data: store
      }, null, 2));
    } else if (pathname === '/clear') {
      // Clear all data
      Object.keys(store).forEach(k => delete store[k]);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'All data cleared' }));
      console.log('🗑 All data cleared');
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch(err) {
    console.error('❌ Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         BPSC Test Series - Sync Backend Server                 ║
╚════════════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}

📡 Endpoints:
   POST   /sync          → Receive data from devices
   GET    /sync          → Send data to devices
   GET    /debug         → View all stored data
   GET    /clear         → Clear all data

🔧 Configuration:
   1. Open the test series in browser
   2. Click ☁ Sync button
   3. Enable Cloud Sync
   4. Set endpoint to: http://localhost:${PORT}/sync
   5. Click "Sync Now"

💡 Pro Tips:
   • Test on multiple devices/browsers
   • Check /debug endpoint to see all data
   • Watch logs as you interact with the app
   • Use /clear to reset data

🔗 Resources:
   • API Spec: See SYNC_API_SPEC.md
   • Features: See FEATURES_GUIDE.md

Press Ctrl+C to stop the server
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Server shutting down...');
  server.close(() => process.exit(0));
});
