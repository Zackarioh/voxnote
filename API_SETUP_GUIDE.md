# 🔑 API Setup Guide for VoxNote Translation

## Overview

VoxNote works **out-of-the-box** with free translation APIs. However, you can configure premium translation services for:

- Higher quality translations
- More daily translations
- Better language support
- Faster response times

---

## 🆓 Free APIs (Already Configured)

### 1. MyMemory Translation API

- **Status**: ✅ Active by default
- **Limit**: 1000 words per day per IP
- **Quality**: Good
- **No API key required**

### 2. LibreTranslate

- **Status**: ✅ Active by default
- **Limit**: Depends on public instance
- **Quality**: Good
- **Open-source**: Yes
- **No API key required**

---

## 💎 Premium APIs (Optional)

### Google Cloud Translation API

**Best for**: High-quality translations, wide language support

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Translation API"
4. Go to "APIs & Services" → "Credentials"
5. Click "Create Credentials" → "API Key"
6. Copy your API key
7. Open `api-config.js` in VoxNote folder
8. Update:
   ```javascript
   googleTranslate: {
       enabled: true,
       apiKey: "YOUR-API-KEY-HERE"
   }
   ```
9. Save and reload VoxNote

**Pricing**: $20 per 1 million characters
**Free tier**: $300 credit (enough for ~15M characters)

---

### Microsoft Azure Translator

**Best for**: Enterprise applications, high accuracy

**Setup Steps:**

1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a "Translator" resource
3. Copy your API key and region
4. Open `api-config.js`
5. Update:
   ```javascript
   microsoftTranslator: {
       enabled: true,
       apiKey: "YOUR-AZURE-KEY",
       region: "YOUR-REGION" // e.g., "eastus"
   }
   ```
6. Save and reload

**Pricing**: $10 per 1 million characters
**Free tier**: 2 million characters per month

---

### DeepL API

**Best for**: Highest quality translations (especially European languages)

**Setup Steps:**

1. Go to [DeepL API](https://www.deepl.com/pro-api)
2. Sign up for DeepL API Free or Pro
3. Get your authentication key
4. Open `api-config.js`
5. Update:
   ```javascript
   deepL: {
       enabled: true,
       apiKey: "YOUR-DEEPL-KEY"
   }
   ```
6. Save and reload

**Pricing**:

- Free: 500,000 characters/month
- Pro: From $5.49/month for 1M characters

---

## 🔧 Configuration File Location

File: `api-config.js` (in the same folder as `index.html`)

### Example Configuration:

```javascript
const API_CONFIG = {
  // Free APIs (active by default)
  myMemory: {
    enabled: true,
    email: "your-email@example.com", // Optional: for higher limits
  },

  libreTranslate: {
    enabled: true,
    url: "https://libretranslate.com/translate",
    apiKey: null, // Optional: Get from libretranslate.com
  },

  // Premium APIs (configure as needed)
  googleTranslate: {
    enabled: true,
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  },

  microsoftTranslator: {
    enabled: true,
    apiKey: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    region: "eastus",
  },

  deepL: {
    enabled: true,
    apiKey: "abc123-xyz789-def456:fx",
  },
};
```

---

## 🔄 API Fallback Order

VoxNote automatically tries APIs in this order until one succeeds:

1. **MyMemory API** (free, reliable)
2. **LibreTranslate** (free, open-source)
3. **Google Translate** (if configured)
4. **Microsoft Translator** (if configured)
5. **DeepL** (if configured)

This ensures you **always get translations** even if one service is down!

---

## 📊 API Comparison

| Service            | Quality    | Speed     | Free Tier     | Best For        |
| ------------------ | ---------- | --------- | ------------- | --------------- |
| **MyMemory**       | ⭐⭐⭐     | Fast      | 1K words/day  | General use     |
| **LibreTranslate** | ⭐⭐⭐     | Medium    | Varies        | Privacy-focused |
| **Google**         | ⭐⭐⭐⭐   | Very Fast | $300 credit   | High volume     |
| **Microsoft**      | ⭐⭐⭐⭐   | Fast      | 2M chars/mo   | Enterprise      |
| **DeepL**          | ⭐⭐⭐⭐⭐ | Fast      | 500K chars/mo | Quality first   |

---

## 🛡️ Security Tips

1. **Never commit API keys to Git**

   - Add `api-config.js` to `.gitignore`
   - Use environment variables in production

2. **Restrict API keys**

   - In Google/Azure console, restrict keys to specific domains
   - Use IP restrictions if possible

3. **Monitor usage**

   - Check your API dashboards regularly
   - Set up billing alerts

4. **Rotate keys**
   - Change API keys periodically
   - Revoke old keys immediately if compromised

---

## 🐛 Troubleshooting

### Translation not working?

1. **Check internet connection**

   - Translation requires internet access

2. **Check browser console**

   - Press F12 → Console tab
   - Look for error messages

3. **Verify API key**

   - Make sure key is correctly copied
   - Check for extra spaces

4. **Check API limits**

   - Free tiers have daily limits
   - Wait 24 hours or upgrade

5. **Try different service**
   - Disable current API
   - Enable another one

### Common Errors:

- **"Translation failed"** → Internet issue or API limit reached
- **"API not configured"** → Check `api-config.js` syntax
- **"401 Unauthorized"** → Invalid API key
- **"429 Too Many Requests"** → Rate limit exceeded

---

## 💡 Tips for Best Results

1. **Start with free APIs** - They work great for most users
2. **Add your email to MyMemory** - Increases daily limit
3. **Use DeepL for important translations** - Best quality
4. **Monitor your usage** - Avoid surprise charges
5. **Keep multiple APIs enabled** - Automatic fallback is reliable

---

## 📞 Support Links

- **MyMemory**: https://mymemory.translated.net/doc/
- **LibreTranslate**: https://libretranslate.com/docs/
- **Google Cloud**: https://cloud.google.com/translate/docs
- **Azure Translator**: https://docs.microsoft.com/azure/cognitive-services/translator/
- **DeepL**: https://www.deepl.com/docs-api

---

**That's it!** VoxNote will automatically use the best available translation service. Start with the free options and upgrade only if needed! 🚀
