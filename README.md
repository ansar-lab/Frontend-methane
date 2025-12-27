# Farm Vaidya - AI-Powered Voice Agent

An intelligent farming expert voice agent built with React, Daily.co, and Pipecat. Have natural voice conversations with an AI farming consultant.

## Features

- 🎤 **Voice Conversations**: Real-time voice chat with AI farming expert
- 🌊 **Visual Feedback**: Waveform animations when AI is speaking, pulse effects when user speaks
- 🔇 **Mute Control**: Toggle microphone on/off during conversation
- 🎨 **Beautiful UI**: Clean, modern interface with farming-themed design
- 🔒 **Secure**: Bearer token authentication with Pipecat API

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Daily.co** - Video/voice infrastructure (@daily-co/daily-js ^0.85.0)
- **Pipecat** - AI voice agent platform
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **shadcn/ui** - UI components

## Getting Started

### Installation

```powershell
# Install dependencies
npm install
```

### Development

```powershell
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```powershell
# Build for production
npm run build
```

### Preview Production Build

```powershell
# Preview production build
npm run preview
```

## How It Works

1. **Connection**: Click the microphone button to start
2. **API Call**: Creates a Pipecat session with Daily.co room
3. **Join Room**: Connects to the voice conversation room
4. **Real-time Audio**: Streams audio through Daily.co infrastructure
5. **AI Response**: Pipecat AI processes speech and responds naturally
6. **Visual Feedback**: UI updates based on speaking status
7. **End**: Click "End Conversation" to disconnect

### Components

- **VoiceAgent.tsx** - Main component with Daily.co integration
  - Connection management with single-flight lock pattern
  - Event listeners for meeting lifecycle
  - Active speaker detection
  - Transcript management
  - Mute/unmute controls

- **UI Components**
  - Button - Styled button with variants
  - Card - Container components
  - Toast - Notification system

### State Management

- `isConnected` - Connection status
- `isSpeaking` - User speaking indicator
- `isAISpeaking` - AI speaking indicator
- `isConnecting` - Loading state
- `isMuted` - Microphone mute status
- `callFrame` - Daily.co instance
- `connectLockRef` - Prevents duplicate connections

### API Integration

**Pipecat API Endpoint:**
```
POST https://api.pipecat.daily.co/v1/public/test/start
```

**Headers:**
```
Authorization: Bearer pk_aff3af37-4821-4efc-9776-1f2d300a52d0
Content-Type: application/json
```

**Request Body:**
```json
{
  "createDailyRoom": true,
  "dailyRoomProperties": {
    "enable_recording": "cloud",
    "privacy": "public"
  },
  "dailyMeetingTokenProperties": {
    "is_owner": true
  }
}
```

## Key Features Explained

### Single-Flight Lock Pattern
Prevents multiple simultaneous connection attempts using `useRef`:
```typescript
const connectLockRef = useRef(false);
// Check and set lock before connecting
if (connectLockRef.current) return;
connectLockRef.current = true;
```

### Preflight Cleanup
Ensures clean state by destroying existing Daily instances:
```typescript
// Cleanup existing frame
if (callFrame) {
  await callFrame.leave();
  await callFrame.destroy();
}
// Cleanup global instance
const existing = DailyIframe.getCallInstance?.();
if (existing) {
  await existing.leave();
  await existing.destroy();
}
```

### Active Speaker Detection
Tracks who is speaking in real-time:
```typescript
.on("active-speaker-change", (event) => {
  const localParticipant = frame.participants().local;
  if (event.activeSpeaker?.peerId === localParticipant.user_id) {
    setIsSpeaking(true);
  } else {
    setIsAISpeaking(true);
  }
})
```

## Custom Styling

### CSS Variables
```css
--primary: 142 76% 36%;      /* Green for farm theme */
--accent: 47 96% 53%;         /* Yellow/golden accent */
--mic-pulse: 340 85% 55%;     /* Pink for pulse animation */
--success: 142 76% 45%;       /* Success green */
```

### Animations
- **pulse-glow** - Microphone button pulsing when user speaks
- **wave** - Waveform bars when AI speaks
- **hover scale** - Button hover effect

## Troubleshooting

### Connection Issues
- Check browser microphone permissions
- Verify API token is valid
- Check network connectivity
- Look for errors in browser console

### Audio Issues
- Ensure microphone is not muted in system settings
- Check Daily.co service status
- Verify audio input device is working

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules; npm install`
- Clear Vite cache: `rm -rf .vite`
- Check TypeScript errors: `npx tsc --noEmit`

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (latest version)

WebRTC support required for voice functionality.

## License

MIT

## Credits

Built with:
- [Daily.co](https://daily.co) - Video/voice infrastructure
- [Pipecat](https://pipecat.ai) - AI voice agent platform
- [Vite](https://vitejs.dev) - Build tool
- [React](https://react.dev) - UI framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library

---

**Farm Vaidya** - Sustainability with Voice Agent 🌱
