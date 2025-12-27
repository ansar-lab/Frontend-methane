# 🚀 Farm Vaidya - Quick Start Guide

## What You've Created

A fully functional AI-powered voice agent application that lets users have natural conversations with an AI farming expert. The application includes:

✅ Voice conversation with AI
✅ Visual waveform when AI speaks
✅ Pulse animation when user speaks
✅ Real-time conversation transcript
✅ Microphone mute/unmute control
✅ Beautiful farming-themed UI
✅ Toast notifications
✅ Responsive design

## 📁 Project Structure

```
chatbot/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx          # Styled button component
│   │   │   ├── card.tsx            # Card container components
│   │   │   ├── tooltip.tsx         # Tooltip component
│   │   │   └── toaster.tsx         # Toast notification placeholder
│   │   └── VoiceAgent.tsx          # Main voice agent component ⭐
│   ├── lib/
│   │   └── utils.ts                # Utility functions (cn)
│   ├── pages/
│   │   └── Index.tsx               # Main page
│   ├── App.tsx                     # App routing & providers
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles & animations
├── public/                         # Static assets
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── README.md                       # Main documentation
├── FEATURES.md                     # Detailed feature docs
└── .gitignore                      # Git ignore rules
```

## 🎯 How to Use the Application

### 1. Start the Application

The dev server is already running at: **http://localhost:5173/**

If you need to restart it:
```powershell
npm run dev
```

### 2. Using the Voice Agent

#### **Starting a Conversation:**
1. Open the application in your browser
2. **Grant microphone permission** when prompted
3. Click the large microphone button (with MicOff icon)
4. Wait for "Connecting..." status
5. Once connected, you'll see "Connected & Ready" (green dot)
6. The AI will speak a welcome message

#### **During Conversation:**
- **When you speak**: 
  - Microphone button pulses with pink glow
  - Status shows "You are speaking..."
  
- **When AI responds**: 
  - Waveform bars appear below button
  - Status shows "Farm Vaidya is speaking..."
  - Bars animate in wave pattern

- **Mute Control**:
  - Click "Mute" button to disable your microphone
  - AI can still speak, but won't hear you
  - Click "Unmute" to re-enable

- **View Transcript**:
  - Scroll through conversation history
  - User messages: Right-aligned, green background
  - AI messages: Left-aligned, gray background
  - Timestamps show when each message was sent

#### **Ending Conversation:**
- Click the red "End Conversation" button
- All states reset
- Ready to start a new conversation

## 🎨 Customization Guide

### Change Colors

Edit `src/index.css`:

```css
:root {
  --primary: 142 76% 36%;      /* Farm green - change for different theme */
  --accent: 47 96% 53%;         /* Yellow accent */
  --mic-pulse: 340 85% 55%;     /* Pink pulse effect */
}
```

### Change Background Image

Edit `src/components/VoiceAgent.tsx`:

```tsx
style={{
  backgroundImage: "url('YOUR_IMAGE_URL_HERE')",
  opacity: 0.2,
}}
```

### Change API Token (Important for Production!)

Edit `src/components/VoiceAgent.tsx`:

```tsx
Authorization: "Bearer YOUR_TOKEN_HERE",
```

**Recommended**: Use environment variables:
```tsx
Authorization: `Bearer ${import.meta.env.VITE_PIPECAT_TOKEN}`,
```

Create `.env` file:
```
VITE_PIPECAT_TOKEN=pk_your_token_here
```

### Modify AI Behavior

The AI behavior is controlled by Pipecat. To customize:
1. Contact Pipecat support for custom configurations
2. Adjust `dailyRoomProperties` in the API call
3. Modify welcome messages in the `participant-joined` event

## 🧪 Testing

### Test Connection:
1. Click microphone button
2. Check browser console for logs
3. Should see "Creating Pipecat session..." and "Successfully joined room"

### Test Microphone:
1. Start conversation
2. Speak into microphone
3. Button should pulse when speaking
4. Check "You are speaking..." status

### Test AI Response:
1. AI should speak welcome message automatically
2. Waveform should appear when AI speaks
3. Status should show "Farm Vaidya is speaking..."

### Test Transcript:
1. Conversation messages should appear in transcript
2. Auto-scroll should work
3. Timestamps should be accurate

### Test Mute Control:
1. Click "Mute" during conversation
2. Toast should show "Microphone muted"
3. Click "Unmute" to re-enable

## 🐛 Common Issues & Solutions

### ❌ "Microphone permission denied"
**Solution**: 
- Go to browser settings
- Allow microphone access for localhost
- Reload page

### ❌ "Failed to connect"
**Solution**:
- Check internet connection
- Verify API token is valid
- Check browser console for specific errors
- Try refreshing the page

### ❌ "No sound from AI"
**Solution**:
- Check system volume
- Ensure browser audio is not muted
- Check speaker/headphone connection
- Try a different browser

### ❌ Button doesn't respond
**Solution**:
- Check if already connected (button disabled when connected)
- Look for "Connecting..." status
- Wait for previous connection to complete

### ❌ Transcript not showing
**Solution**:
- Messages should appear automatically
- Check browser console for errors
- Ensure conversation is active

## 📦 Build for Production

### Create Production Build:
```powershell
npm run build
```

Files will be in `dist/` folder.

### Preview Production Build:
```powershell
npm run preview
```

### Deploy:
Upload `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Your web server

**Important**: Ensure HTTPS for microphone access!

## 🔧 Development Commands

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check TypeScript errors
npx tsc --noEmit

# Format code (if prettier installed)
npx prettier --write .
```

## 📚 Key Files to Understand

### `VoiceAgent.tsx` - The Heart of the App
- Contains all voice agent logic
- Daily.co integration
- State management
- Event listeners
- UI components

### `index.css` - Styles & Animations
- Tailwind configuration
- Custom CSS variables
- Pulse animation
- Waveform animation

### `App.tsx` - App Setup
- React Router
- Toast notifications
- Query client
- Tooltip provider

## 🎓 Learning Resources

### Daily.co Documentation:
https://docs.daily.co/

### Pipecat Documentation:
https://www.pipecat.ai/docs

### React Documentation:
https://react.dev/

### Tailwind CSS:
https://tailwindcss.com/

## 🤝 Getting Help

If you encounter issues:

1. **Check browser console** for error messages
2. **Review FEATURES.md** for implementation details
3. **Test in different browser** (Chrome recommended)
4. **Check microphone permissions**
5. **Verify API token is valid**

## 🎉 Next Steps

Now that your app is running:

1. ✅ Test all features thoroughly
2. ✅ Customize colors and branding
3. ✅ Add your own background image
4. ✅ Test on different devices
5. ✅ Build for production
6. ✅ Deploy to web server
7. ✅ Share with users!

## 🌟 Pro Tips

1. **Always use HTTPS in production** (required for microphone access)
2. **Store API token in environment variables** (not in code)
3. **Test microphone before going live** with users
4. **Monitor Daily.co usage** to avoid quota limits
5. **Add error tracking** (Sentry, LogRocket) for production
6. **Optimize images** for faster loading
7. **Add loading states** for better UX

---

**You're all set! Start having conversations with Farm Vaidya!** 🌱🎤

Need help? Check FEATURES.md or README.md for more details.
