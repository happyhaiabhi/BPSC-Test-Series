# 🚀 GitHub Sync Setup - Quick Guide

## What Changed?

Simplified cross-device sync using **GitHub Gists** - no backend server needed!

## Setup in 3 Steps

### Step 1️⃣: Create GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `BPSC-Sync`
4. Check **✓ gist** scope
5. Click **Generate token**
6. Copy the token (you'll need it in a moment!)

### Step 2️⃣: Connect App to GitHub

1. Open the BPSC Test Series app
2. Click **☁ Sync** button (top-right)
3. Check **"Enable GitHub Sync"**
4. Paste your GitHub token in the **"GitHub Personal Access Token"** field
5. Click **"Test Connection"**

Expected message:

```
✓ Connected as YOUR_GITHUB_USERNAME
```

### Step 3️⃣: Start Syncing

1. Click **"Sync Now"** to create a private Gist
2. Watch the status dot turn **green** (synced)
3. Open the app on another device
4. Follow Steps 1-2 on that device
5. Your progress automatically syncs! ✨

---

## What Gets Synced?

- ✅ History (test attempts)
- ✅ Mistakes (wrong answers)
- ✅ Bookmarks (marked questions)
- ✅ Skips (practice questions)
- ✅ Archive (mastered questions)

## Auto-Sync Frequency

- Every **30 seconds** when you're online
- Manual **"Sync Now"** anytime

## Troubleshooting

| Issue                | Solution                                         |
| -------------------- | ------------------------------------------------ |
| ❌ Invalid token     | Create a new token at github.com/settings/tokens |
| 🔴 Connection failed | Check internet connection, refresh page          |
| 🟡 Still syncing     | Wait 30 seconds, or click "Sync Now"             |
| Data not appearing   | Refresh page after sync completes                |

## Where's My Data?

Your synced data is stored in a **private Gist** only you can see.

View it here: https://gist.github.com

(Look for "BPSC Test Series - Cross-Device Sync")

---

## Security

✅ **Private Gist** - Only you can access your data
✅ **GitHub API** - Industry-standard authentication
✅ **Token-based** - No passwords stored

⚠️ **Keep your token safe!** It provides access to your synced data.

---

## Need Help?

1. Make sure GitHub token has **gist** scope checked
2. Verify you're using a **personal access token**, not OAuth
3. Check that sync is **enabled** in the modal
4. Try **"Test Connection"** to verify token

---

## Switching Devices

### Laptop → Phone

1. Enable sync on laptop (Steps 1-2 above)
2. Click "Sync Now"
3. On phone, enable sync with **same GitHub token**
4. Your progress appears automatically!

### Multiple Devices

Use the **same GitHub token** on all devices for automatic syncing.

---

## That's It! 🎉

Your BPSC test progress now syncs across all your devices through GitHub!

Happy studying! 📚
