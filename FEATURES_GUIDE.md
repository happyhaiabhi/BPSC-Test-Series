# BPSC Test Series - Setup & Features Guide

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor for configuration
- (Optional) Backend API for cross-device sync

### Running the App

#### Option 1: Local File

1. Open `index.html` in your browser
2. Start taking tests!

#### Option 2: HTTP Server (Recommended)

```bash
# Using Python 3
python -m http.server 8000

# Or Node.js
npx http-server

# Or any other HTTP server
```

Then visit: `http://localhost:8000`

---

## 📱 Responsive Design

The app automatically adapts to any device:

| Device      | Breakpoint | Layout                                      |
| ----------- | ---------- | ------------------------------------------- |
| **Mobile**  | < 600px    | 1-column grid, hidden palette, 48px buttons |
| **Tablet**  | 600-1023px | 2-column grid, 4-col palette, 44px buttons  |
| **Desktop** | ≥ 1024px   | 3-column grid, full palette, normal buttons |

**Features:**

- ✓ Touch-friendly buttons on mobile (minimum 48px)
- ✓ Optimized font sizes for readability
- ✓ Flexible layouts for any screen size
- ✓ Persistent UI state across devices

---

## ☁️ Cross-Device Sync Setup

### Step 1: Enable Sync in App

1. Click **☁ Sync** button (top-right navbar)
2. Check **"Enable Cloud Sync"**
3. Enter API endpoint: `https://your-api.com/sync`
4. Copy your **Device ID** for reference

### Step 2: Deploy Backend

Choose from the provided examples:

- **Node.js + Express** - Easy, popular
- **Python + Flask** - Simple, beginner-friendly
- **Your own stack** - Follow the API spec

See [SYNC_API_SPEC.md](SYNC_API_SPEC.md) for detailed examples.

### Step 3: Test Connection

1. Click **"Sync Now"** in the Sync modal
2. Watch for status dot changes:
   - 🟡 Gold = Syncing
   - 🟢 Green = Synced ✓
   - 🔴 Red = Error
   - ⚪ Gray = Offline

### Step 4: Use Across Devices

Open the app on different devices with same Google account:

- ✓ All progress syncs automatically every 30 seconds
- ✓ Works offline (caches locally via IndexedDB)
- ✓ Works on laptop, tablet, and phone

---

## 📊 Features

### Question Types Supported

- **MCQ** (Multiple Choice) - Single answer
- **Assertion-Reason** - Two independent statements
- **Statements** - Roman numeral list questions
- **Match the Column** - Two-column matching

### Data Tracked

- **History** - All attempted questions with answers
- **Mistakes** - Wrong answers for focused review
- **Bookmarks** - Questions to review later
- **Skips** - Questions marked for more practice
- **Archive** - Questions mastered (≥5 correct)

### UI Modes

- **Setup Screen** - Browse tests by subject
- **Quiz Screen** - Full-screen question viewing
- **Results Screen** - Performance analysis
- **Review Screens** - Mistakes, bookmarks, skips, archive

### Keyboard Shortcuts

- `Space` - Next question
- `Shift+Space` - Previous question
- `Ctrl+Shift+E` - End test
- `Ctrl+Shift+D` - Toggle dark mode

---

## 🔧 Configuration

### Via Browser Console

```javascript
// Enable sync programmatically
localStorage.setItem("priya_sync_enabled", "true");
localStorage.setItem("priya_sync_endpoint", "https://api.example.com/sync");
location.reload();

// View device ID
console.log(SYNC_CONFIG.deviceId);

// Manually sync
pullDataFromCloud();

// Check sync config
console.log(SYNC_CONFIG);
```

### Via Sync Modal

1. Click ☁ Sync
2. Toggle "Enable Cloud Sync"
3. Paste your API endpoint
4. Click "Sync Now"

---

## 🐛 Troubleshooting

### App not loading

- ✓ Check browser console (F12) for errors
- ✓ Clear browser cache and reload
- ✓ Try a different browser
- ✓ Use `python -m http.server 8000` for local testing

### Sync not working

- ✓ Check internet connection
- ✓ Verify API endpoint is correct
- ✓ Check browser console for error messages
- ✓ Verify backend server is running
- ✓ Test API with cURL: `curl https://api.example.com/sync`

### Data not syncing

- ✓ Check SYNC_CONFIG.enabled is true
- ✓ Click "Sync Now" manually
- ✓ Check backend logs for errors
- ✓ Ensure API returns proper JSON

### Responsive design issues

- ✓ Zoom to 100% (Ctrl+0)
- ✓ Resize browser window
- ✓ Test on different devices
- ✓ Check if CSS media queries are active

---

## 📁 File Structure

```
test-series/
├── index.html                 # Main app (all-in-one)
├── data/
│   └── tests/
│       ├── test_04.json      # Test questions (mixed types)
│       ├── test_10.json      # Test questions (MCQ)
│       └── ...
├── SYNC_API_SPEC.md          # API documentation
└── README.md                  # This file
```

---

## 🛠 Development

### Question Format (JSON)

```json
{
  "uid": "q_001",
  "type": "mcq",
  "question": "What is 2+2?",
  "options": ["2", "4", "6", "8"],
  "correctAnswer": "b"
}
```

### Add New Question Type

1. Edit `questionFormatters` in index.html (line ~625)
2. Add formatter function:

```javascript
const questionFormatters = {
  mytype: (q) => `<div>${q.myfield}</div>`,
};
```

3. JSON will automatically use it

### Modify Colors

Edit CSS variables at the top of `<style>`:

```css
:root {
  --gold: #c9a84c;
  --green: #10b981;
  --red: #ef4444;
  /* ... */
}
```

---

## 🔐 Security Notes

⚠️ **Current Implementation:**

- No user authentication
- Data stored in browser (localStorage/IndexedDB)
- Sync uses device ID only

**For Production:**

- Add user authentication
- Use HTTPS/TLS
- Validate all inputs
- Implement rate limiting
- Monitor data access
- Add encryption

---

## 📊 Browser Support

| Browser | Version | Support          |
| ------- | ------- | ---------------- |
| Chrome  | 60+     | ✅ Full          |
| Firefox | 55+     | ✅ Full          |
| Safari  | 11+     | ✅ Full          |
| Edge    | 79+     | ✅ Full          |
| IE      | Any     | ❌ Not supported |

---

## 📞 Support

For issues or questions:

1. Check browser console (F12) for errors
2. Review [SYNC_API_SPEC.md](SYNC_API_SPEC.md) for API details
3. Test backend with provided curl commands
4. Check network tab in DevTools

---

## 📝 License & Attribution

BPSC Test Series - Civil Service Mock Tests
Built with vanilla JavaScript, no external dependencies.

---

## ✨ Features Roadmap

- [ ] User authentication (Google Sign-In)
- [ ] Cloud storage (Firebase/AWS)
- [ ] Performance analytics
- [ ] AI-powered recommendations
- [ ] Collaborative learning
- [ ] Mobile app (React Native)

---

## 🙏 Thank You

Thank you for using BPSC Test Series!
Happy learning! 📚
