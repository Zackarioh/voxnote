# 🎙️ VoxNote - Voice to Text & Translation Application

A beautiful, feature-rich web application that converts voice recordings into text with real-time translation capabilities and modern UI/UX design.

## ✨ Features

### 🔐 Authentication System

- **Login/Signup** - Secure user authentication with local storage
- **Demo Mode** - Quick access with demo login
- **User Management** - Personalized experience for each user

### 🎤 Voice Recording

- **Real-time Voice-to-Text** - Uses Web Speech API for instant transcription
- **Multi-language Support** - 10+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, etc.
- **Live Timer** - Visual recording timer with animated indicators
- **Visual Feedback** - Pulsing microphone animation while recording
- **Continuous Recording** - Records until you stop, with automatic restart

### 🌐 Voice Translation (NEW!)

- **Speak & Translate** - Record in one language and translate to another in real-time
- **15+ Languages** - Translate between English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, Russian, Dutch, Polish, Turkish, and more
- **Auto-Translation** - Automatic translation as you speak
- **Language Swap** - Quickly swap source and target languages
- **Text-to-Speech** - Hear both original and translated text
- **Save Translations** - Save translation pairs as notes for future reference
- **Copy Both Sides** - Easily copy original or translated text

### 📝 Note Management

- **Auto-save Notes** - Save transcribed text as notes with custom titles
- **Edit Notes** - Full CRUD operations (Create, Read, Update, Delete)
- **Favorites** - Star your important notes
- **Tags System** - Organize notes with custom tags
- **Export Options** - Export individual notes or all notes as text files

### 🔍 Search & Filter

- **Real-time Search** - Search across titles, content, and tags
- **Smart Filters** - Filter by All, Today, This Week, or Favorites
- **Tag Filtering** - Click any tag to filter notes
- **Multiple Sort Options** - Sort by date (newest/oldest) or title (A-Z/Z-A)

### 🎨 Beautiful UI/UX

- **Modern Design** - Gradient backgrounds, glassmorphism effects
- **Smooth Animations** - Engaging transitions and hover effects
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Visual Feedback** - Toast notifications for all actions
- **Dual Mode Interface** - Switch between Voice Notes and Voice Translator modes

### 📊 Statistics Dashboard

- **Total Notes** - Track your note count
- **Total Words** - See how many words you've transcribed
- **Weekly Stats** - Notes created this week
- **Tag Cloud** - Visual representation of all your tags

### 🔊 Text-to-Speech

- **Read Aloud** - Listen to your notes with text-to-speech
- **Language Support** - Reads in the selected language

### 📱 Additional Features

- **Copy to Clipboard** - Quick copy transcribed text
- **Clear Transcript** - Reset the recording area
- **Word Count** - See word count for each note
- **Timestamps** - Auto-generated timestamps for all notes
- **User Menu** - Easy access to profile and logout

## 🚀 How to Use

### Getting Started

1. **Open `index.html`** in your web browser
2. **Sign Up** with your name, email, and password, or use **Demo Login**
3. You'll be redirected to the home dashboard

### Recording Your First Note

1. Make sure you're on the **"Voice Notes"** tab
2. Click the **microphone button** to start recording
3. Speak clearly - your speech will be transcribed in real-time
4. Click again to **stop recording**
5. Add a **title** and **tags** (optional)
6. Click **Save Note**

### Using the Voice Translator (NEW!)

1. Click the **"Voice Translator"** tab at the top
2. Select your **source language** (the language you'll speak)
3. Select your **target language** (the language to translate to)
4. Click the **microphone button** and start speaking
5. Your speech appears in the "Original Text" box
6. Translation appears automatically in the "Translated Text" box
7. Use action buttons to:
   - 🔊 **Play** - Hear the original or translated text
   - 📋 **Copy** - Copy text to clipboard
   - 🔄 **Swap** - Switch source and target languages
   - 💾 **Save Translation** - Save as a note with both texts
   - 🗑️ **Clear** - Start over

### Managing Notes

- **Search**: Type in the search bar to find notes
- **Filter**: Use sidebar filters (All, Today, Week, Favorites)
- **Sort**: Choose sort order from dropdown
- **Edit**: Click edit icon on any note
- **Delete**: Click delete icon (with confirmation)
- **Favorite**: Click star icon to mark as favorite
- **Read**: Click speaker icon to hear the note read aloud
- **Export**: Download individual notes or all notes

### Using Dark Mode

- Click the **moon icon** in the navbar to toggle dark mode
- Your preference is saved automatically

## 🌐 Supported Languages

- English (US & UK)
- Spanish
- French
- German
- Italian
- Portuguese (Brazilian)
- Chinese (Mandarin)
- Japanese
- Korean
- Arabic
- Hindi
- Russian
- Dutch
- Polish
- Turkish
- And more!

## 💾 Data Storage

- All data is stored locally in your browser's localStorage
- No server required - 100% client-side application (except translation API)
- Your notes and translations are private and secure
- Data persists between sessions

## 🎯 Key Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks required
- **Web Speech API** - Voice recognition
- **Speech Synthesis API** - Text-to-speech
- **Multiple Translation APIs** - MyMemory (free), LibreTranslate (free/open-source)
- **LocalStorage API** - Data persistence

## 🔧 Translation API Configuration

VoxNote uses **free translation APIs** by default, but you can configure premium services for better quality:

### Default (No Configuration Needed)

- **MyMemory API** - Free, 1000 words/day
- **LibreTranslate** - Free and open-source

### Optional Premium APIs (Edit `api-config.js`)

- **Google Cloud Translation** - High quality, pay-as-you-go
- **Microsoft Azure Translator** - Enterprise-grade
- **DeepL API** - Best quality translations

**To add your API keys:**

1. Open `api-config.js`
2. Enable the service: `enabled: true`
3. Add your API key: `apiKey: "your-key-here"`
4. Save and reload

## 📱 Browser Compatibility

Works best in modern browsers that support Web Speech API:

- ✅ Google Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Safari (partial support)
- ⚠️ Firefox (limited speech recognition support)

## 🎨 Design Highlights

- **Gradient backgrounds** with clean design
- **Glassmorphism cards** for modern look
- **Smooth transitions** on all interactions
- **Responsive grid layout** for notes
- **Color-coded tags** for easy identification
- **Pulsing animations** during recording
- **Toast notifications** for user feedback
- **Animated translation arrows** for visual flow

## 🔒 Privacy & Security

- Notes stored locally in your browser
- All processing happens in your browser
- No tracking or analytics
- You own your data completely

## 💡 Tips for Best Results

1. **Use Chrome** for best speech recognition accuracy
2. **Speak clearly** and at moderate pace
3. **Minimize background noise** for better accuracy
4. **Use proper microphone** for better quality
5. **Add tags** to organize notes efficiently
6. **Export regularly** as backup

## 🐛 Troubleshooting

**Microphone not working?**

- Check browser permissions for microphone access
- Ensure your device has a working microphone
- Try refreshing the page

**Speech recognition not starting?**

- Make sure you're using a supported browser (Chrome recommended)
- Check console for error messages
- Verify microphone permissions

**Notes not saving?**

- Check if localStorage is enabled in your browser
- Clear browser cache if storage is full

## 📄 License

This is a demonstration project. Feel free to use and modify as needed.

## 👨‍💻 Created By

Built with ❤️ as a modern voice-to-text solution

---

**Enjoy taking notes with your voice! 🎤✨**
