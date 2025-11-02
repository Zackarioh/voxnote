// API Configuration for VoxNote Translation Services
// This file allows you to configure your own API keys for better translation quality

const API_CONFIG = {
    // MyMemory Translation API (Free, no key required)
    // Default: Uses free tier (limited to 1000 words/day per IP)
    myMemory: {
        enabled: true,
        email: null, // Optional: Add your email for higher limits
        // Example: email: "your-email@example.com"
    },

    // LibreTranslate API (Free and open-source)
    // Default: Uses public instance
    libreTranslate: {
        enabled: true,
        url: 'https://libretranslate.com/translate',
        apiKey: null, // Optional: Get free API key from https://libretranslate.com
        // Example: apiKey: "your-api-key-here"
    },

    // Google Cloud Translation API (Premium, requires API key)
    // Get API key: https://cloud.google.com/translate/docs/setup
    googleTranslate: {
        enabled: false, // Set to true if you have an API key
        apiKey: null,
        // Example: apiKey: "AIzaSy..."
    },

    // Microsoft Azure Translator (Premium, requires subscription)
    // Get keys: https://azure.microsoft.com/en-us/services/cognitive-services/translator/
    microsoftTranslator: {
        enabled: false, // Set to true if you have a subscription
        apiKey: null,
        region: 'global', // Your Azure region
        // Example: apiKey: "your-azure-key"
        // Example: region: "eastus"
    },

    // DeepL API (Premium, high quality translations)
    // Get API key: https://www.deepl.com/pro-api
    deepL: {
        enabled: false, // Set to true if you have an API key
        apiKey: null,
        // Example: apiKey: "your-deepl-key"
    }
};

// Enhanced translation function with API key support
async function translateWithGoogleTranslate(text, sourceLang, targetLang) {
    if (!API_CONFIG.googleTranslate.enabled || !API_CONFIG.googleTranslate.apiKey) {
        throw new Error('Google Translate API not configured');
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_CONFIG.googleTranslate.apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            source: sourceLang === 'auto' ? undefined : sourceLang,
            target: targetLang,
            format: 'text'
        })
    });

    if (!response.ok) throw new Error('Google Translate API request failed');

    const data = await response.json();
    
    if (data.data && data.data.translations && data.data.translations[0]) {
        return data.data.translations[0].translatedText;
    }

    throw new Error('No translation returned from Google');
}

async function translateWithDeepL(text, sourceLang, targetLang) {
    if (!API_CONFIG.deepL.enabled || !API_CONFIG.deepL.apiKey) {
        throw new Error('DeepL API not configured');
    }

    const url = 'https://api-free.deepl.com/v2/translate';
    
    const params = new URLSearchParams({
        auth_key: API_CONFIG.deepL.apiKey,
        text: text,
        target_lang: targetLang.toUpperCase()
    });

    if (sourceLang !== 'auto') {
        params.append('source_lang', sourceLang.toUpperCase());
    }

    const response = await fetch(url, {
        method: 'POST',
        body: params
    });

    if (!response.ok) throw new Error('DeepL API request failed');

    const data = await response.json();
    
    if (data.translations && data.translations[0]) {
        return data.translations[0].text;
    }

    throw new Error('No translation returned from DeepL');
}

// Export configuration for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
