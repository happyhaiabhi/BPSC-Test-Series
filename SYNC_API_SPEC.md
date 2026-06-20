# Cross-Device Sync API Specification

## Overview

The BPSC test series now supports automatic cross-device synchronization of:

- **History** - Test completion records
- **Mistakes** - Incorrect answers for focused learning
- **Bookmarks** - Marked questions for later review
- **Skips** - Questions to practice more
- **Archive** - Mastered questions

## Quick Start

### 1. Enable Sync in the App

1. Open the test series in your browser
2. Click the **☁ Sync** button in the top navbar
3. Check **"Enable Cloud Sync"**
4. Enter your API endpoint (e.g., `https://api.example.com/sync`)
5. Click **"Sync Now"** to test the connection

### 2. Deploy Backend

The backend must support two endpoints:

#### **POST /sync** - Push Data

```json
{
  "deviceId": "device_1234567890_abc123",
  "dataKey": "history|mistakes|bookmarks|skips|archive",
  "data": {
    /* actual data object */
  },
  "timestamp": 1704067200000
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Data synced"
}
```

#### **GET /sync?deviceId={deviceId}** - Pull Data

**Response (200 OK):**

```json
{
  "history": [
    /* array */
  ],
  "mistakes": {
    /* object */
  },
  "bookmarks": {
    /* object */
  },
  "skips": {
    /* object */
  },
  "archive": {
    /* object */
  }
}
```

---

## Example Implementations

### Node.js + Express + MongoDB

```javascript
const express = require("express");
const app = express();
app.use(express.json());

const db = {}; // Replace with MongoDB connection

// POST /sync - Push data to cloud
app.post("/sync", async (req, res) => {
  const { deviceId, dataKey, data, timestamp } = req.body;

  if (!deviceId || !dataKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Store data with timestamp for conflict resolution
    if (!db[deviceId]) db[deviceId] = {};
    db[deviceId][dataKey] = { data, timestamp };

    res.json({ success: true, message: "Data synced" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /sync - Pull data from cloud
app.get("/sync", async (req, res) => {
  const { deviceId } = req.query;

  if (!deviceId) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  try {
    const userData = db[deviceId] || {};
    const response = {
      history: userData.history?.data || [],
      mistakes: userData.mistakes?.data || {},
      bookmarks: userData.bookmarks?.data || {},
      skips: userData.skips?.data || {},
      archive: userData.archive?.data || {},
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Sync API running on port 3000"));
```

### Python + Flask + SQLite

```python
from flask import Flask, request, jsonify
import json
import sqlite3
from datetime import datetime

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('sync_data.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS sync_data
                    (device_id TEXT, data_key TEXT, data TEXT, timestamp REAL,
                     PRIMARY KEY (device_id, data_key))''')
    return conn

@app.route('/sync', methods=['POST'])
def push_sync():
    data = request.get_json()
    device_id = data.get('deviceId')
    data_key = data.get('dataKey')
    payload = data.get('data')
    timestamp = data.get('timestamp')

    if not device_id or not data_key:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db()
        conn.execute('INSERT OR REPLACE INTO sync_data VALUES (?, ?, ?, ?)',
                     (device_id, data_key, json.dumps(payload), timestamp))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Data synced'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sync', methods=['GET'])
def pull_sync():
    device_id = request.args.get('deviceId')

    if not device_id:
        return jsonify({'error': 'Missing deviceId'}), 400

    try:
        conn = get_db()
        cursor = conn.execute('SELECT data_key, data FROM sync_data WHERE device_id = ?',
                              (device_id,))
        rows = cursor.fetchall()
        conn.close()

        response = {
            'history': [],
            'mistakes': {},
            'bookmarks': {},
            'skips': {},
            'archive': {}
        }

        for key, value in rows:
            if key in response:
                response[key] = json.loads(value)

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

---

## Data Structures

### History

```json
[
  {
    "testId": "test_04",
    "uid": "q_001",
    "answered": true,
    "correct": true,
    "userKey": "b",
    "timeSpent": 45000,
    "endAt": "2024-01-01T10:30:00Z"
  }
]
```

### Mistakes

```json
{
  "q_001": {
    "q": {
      /* question object */
    },
    "userKey": "b",
    "addedAt": "2024-01-01T10:30:00Z",
    "times": 3,
    "correctCount": 1
  }
}
```

### Bookmarks / Skips / Archive

Similar object structure with question metadata

---

## Conflict Resolution

When multiple devices update the same data:

1. **Last-write-wins**: Device with latest timestamp wins
2. **Per-key storage**: Each data type (history, mistakes, etc.) has its own timestamp
3. **Timestamp check**: Server ignores data older than what's stored

To implement better conflict resolution:

```javascript
// Server-side merge logic
if (incoming.timestamp > stored.timestamp) {
  // Use incoming data
} else if (incoming.timestamp === stored.timestamp) {
  // Merge arrays/objects intelligently
  // For arrays: combine unique items
  // For objects: merge keys
}
```

---

## Testing the Sync

### Using cURL

```bash
# Push data
curl -X POST http://localhost:3000/sync \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device_test_123",
    "dataKey": "history",
    "data": [{"testId": "test_04", "correct": true}],
    "timestamp": 1704067200000
  }'

# Pull data
curl "http://localhost:3000/sync?deviceId=device_test_123"
```

### Using the App

1. Set `priya_sync_endpoint` in localStorage: `localStorage.setItem('priya_sync_endpoint', 'http://localhost:3000/sync')`
2. Reload the page
3. Click ☁ Sync → Enable Cloud Sync
4. Click "Sync Now"
5. Check browser console for sync logs

---

## Security Considerations

⚠️ **Current Implementation Notes:**

- No authentication (device ID only)
- Data sent in plaintext
- No data validation or rate limiting

**Recommendations for Production:**

1. Add JWT or API key authentication
2. Enable HTTPS/TLS
3. Validate all input data
4. Implement rate limiting (prevent abuse)
5. Add CORS headers properly
6. Hash sensitive data
7. Log all sync activities
8. Set data retention policies

---

## Troubleshooting

### Sync shows "Offline"

- Check internet connection
- Verify API endpoint in Sync modal
- Check browser console for errors

### Sync shows "Error" (red)

- Verify endpoint is correct and reachable
- Check server logs for request errors
- Ensure server returns JSON (not HTML)
- Check CORS headers if cross-origin

### Data not syncing automatically

- Make sure SYNC_CONFIG.enabled = true in localStorage
- Check that endpoint is set
- Verify network connectivity

---

## API Response Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| 200  | Success                 |
| 400  | Missing required fields |
| 401  | Unauthorized            |
| 404  | Not found               |
| 500  | Server error            |
| 503  | Service unavailable     |

---

## Advanced: Custom Headers

For authentication, the client can be modified to send custom headers:

```javascript
// Modify syncDataToCloud function in index.html
const response = await fetch(`${SYNC_CONFIG.endpoint}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_API_KEY",
    "X-Device-ID": SYNC_CONFIG.deviceId,
  },
  body: JSON.stringify(payload),
});
```

---

## Offline Support

The app uses IndexedDB to cache data locally. Even without internet:

- ✓ All data synced to this device persists
- ✓ Can continue using the app offline
- ✗ Won't sync to other devices until online
- ✗ Won't fetch cloud data until online

---

## Support & Contributing

For issues or suggestions, visit the repository or contact support.
