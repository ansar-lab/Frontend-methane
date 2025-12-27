# Farm Vaidya - Technical Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │           VoiceAgent Component                   │    │  │
│  │  │                                                  │    │  │
│  │  │  State Management:                              │    │  │
│  │  │  • isConnected, isSpeaking, isAISpeaking       │    │  │
│  │  │  • isMuted, isConnecting                       │    │  │
│  │  │  • transcript[], callFrame                     │    │  │
│  │  │  • connectLockRef (prevents duplicates)        │    │  │
│  │  │                                                  │    │  │
│  │  │  ┌────────────────────────────────────┐        │    │  │
│  │  │  │   UI Layer                         │        │    │  │
│  │  │  │   • Microphone Button              │        │    │  │
│  │  │  │   • AI Waveform Indicator          │        │    │  │
│  │  │  │   • Status Text & Connection Dot   │        │    │  │
│  │  │  │   • Mute/Unmute Button             │        │    │  │
│  │  │  │   • Transcript Display             │        │    │  │
│  │  │  │   • End Conversation Button        │        │    │  │
│  │  │  └────────────────────────────────────┘        │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │        Daily.co Client (@daily-co/daily-js)      │    │  │
│  │  │                                                  │    │  │
│  │  │  • DailyIframe.createFrame()                    │    │  │
│  │  │  • frame.join(roomUrl, token)                   │    │  │
│  │  │  • Event Listeners:                             │    │  │
│  │  │    - joined-meeting                             │    │  │
│  │  │    - left-meeting                               │    │  │
│  │  │    - active-speaker-change                      │    │  │
│  │  │    - participant-joined/left                    │    │  │
│  │  │    - error                                       │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Pipecat API Server                          │
│                  api.pipecat.daily.co                           │
│                                                                  │
│  POST /v1/public/test/start                                     │
│  Authorization: Bearer pk_aff3af37...                           │
│                                                                  │
│  Request:                                                        │
│  {                                                               │
│    createDailyRoom: true,                                       │
│    dailyRoomProperties: {                                       │
│      enable_recording: "cloud",                                 │
│      privacy: "public"                                          │
│    },                                                            │
│    dailyMeetingTokenProperties: {                               │
│      is_owner: true                                             │
│    }                                                             │
│  }                                                               │
│                                                                  │
│  Response:                                                       │
│  {                                                               │
│    room_url: "https://pipecat.daily.co/room-name",             │
│    token: "eyJhbGciOiJIUzI1NiIs...",                           │
│    config: {...}                                                │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Daily.co Infrastructure                       │
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │   Video/Audio    │         │   AI Voice Bot    │            │
│  │   Streaming      │◄───────►│   (Pipecat)       │            │
│  │   (WebRTC)       │         │                   │            │
│  └──────────────────┘         └──────────────────┘            │
│         │                              │                        │
│         │                              │                        │
│  ┌──────▼──────────┐         ┌────────▼─────────┐            │
│  │  Cloud          │         │  Speech-to-Text   │            │
│  │  Recording      │         │  Text-to-Speech   │            │
│  └─────────────────┘         └───────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Connection Flow

```
1. User Action
   │
   ├─► Click Microphone Button
   │
2. Connection Lock
   │
   ├─► Check connectLockRef.current
   │   (Prevent duplicate connections)
   │
3. API Request
   │
   ├─► POST to Pipecat API
   │   • Authorization: Bearer token
   │   • Create Daily room
   │   • Request meeting token
   │
4. API Response
   │
   ├─► Receive room_url and token
   │
5. Cleanup
   │
   ├─► Destroy existing Daily frames
   │   • callFrame.leave()
   │   • callFrame.destroy()
   │   • Clean global instances
   │
6. Create Daily Frame
   │
   ├─► DailyIframe.createFrame()
   │   • Hidden iframe (1x1px, opacity 0)
   │   • No UI controls
   │
7. Set Up Event Listeners
   │
   ├─► joined-meeting
   ├─► left-meeting
   ├─► active-speaker-change
   ├─► participant-joined
   ├─► participant-left
   ├─► error
   │
8. Join Room
   │
   ├─► frame.join({ url, token })
   │
9. Update UI
   │
   ├─► setIsConnected(true)
   ├─► Show "Connected & Ready"
   ├─► Green status dot
   │
10. Ready for Conversation
    │
    └─► Wait for user speech
```

### Speaking Detection Flow

```
User Speaks
   │
   ├─► Microphone captures audio
   │
   ├─► Daily.co detects audio activity
   │
   ├─► Fires "active-speaker-change" event
   │
   ├─► Check if speaker is local participant
   │   │
   │   ├─► YES: User is speaking
   │   │   │
   │   │   ├─► setIsSpeaking(true)
   │   │   ├─► setIsAISpeaking(false)
   │   │   ├─► Apply pulse animation to button
   │   │   └─► Show "You are speaking..." status
   │   │
   │   └─► NO: AI is speaking
   │       │
   │       ├─► setIsSpeaking(false)
   │       ├─► setIsAISpeaking(true)
   │       ├─► Show waveform animation
   │       └─► Show "Farm Vaidya is speaking..." status
   │
   └─► Audio sent to Pipecat AI for processing
```

### Transcript Update Flow

```
Conversation Event
   │
   ├─► addToTranscript(speaker, text)
   │
   ├─► Create TranscriptMessage object
   │   • id: timestamp
   │   • speaker: "user" | "ai"
   │   • text: message content
   │   • timestamp: Date object
   │
   ├─► Update transcript state
   │   setTranscript(prev => [...prev, newMessage])
   │
   ├─► Trigger useEffect
   │
   ├─► Auto-scroll to bottom
   │   transcriptEndRef.current?.scrollIntoView()
   │
   └─► Render message in UI
       • Right-aligned (user)
       • Left-aligned (ai)
       • With timestamp
```

## 🎯 Component Hierarchy

```
App
 │
 ├─► QueryClientProvider
 │    │
 │    └─► TooltipProvider
 │         │
 │         ├─► Sonner (Toast notifications)
 │         │
 │         └─► BrowserRouter
 │              │
 │              └─► Routes
 │                   │
 │                   └─► Route "/"
 │                        │
 │                        └─► Index
 │                             │
 │                             └─► VoiceAgent
 │                                  │
 │                                  ├─► Background Image
 │                                  │
 │                                  ├─► Logo & Tagline
 │                                  │
 │                                  └─► Card
 │                                       │
 │                                       ├─► CardHeader
 │                                       │    └─► CardTitle
 │                                       │
 │                                       └─► CardContent
 │                                            │
 │                                            ├─► Button (Mic)
 │                                            ├─► AI Waveform
 │                                            ├─► Status Text
 │                                            ├─► Status Dot
 │                                            ├─► Mute Button
 │                                            ├─► Transcript
 │                                            └─► End Button
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────┐
│           Client-Side Security              │
│                                             │
│  • API Token (Bearer)                       │
│    - Currently hardcoded (demo)             │
│    - Should be env variable (production)    │
│                                             │
│  • HTTPS Required                           │
│    - For microphone access                  │
│    - For secure communication               │
│                                             │
│  • Room Privacy                             │
│    - Currently "public"                     │
│    - Configure for production               │
│                                             │
│  • Token Expiration                         │
│    - Daily.co tokens expire                 │
│    - Refresh mechanism needed               │
└─────────────────────────────────────────────┘
         │
         │ Encrypted HTTPS
         ▼
┌─────────────────────────────────────────────┐
│          Pipecat API Security               │
│                                             │
│  • Bearer Token Authentication              │
│  • Rate Limiting                            │
│  • Request Validation                       │
│  • CORS Configuration                       │
└─────────────────────────────────────────────┘
         │
         │
         ▼
┌─────────────────────────────────────────────┐
│        Daily.co Infrastructure              │
│                                             │
│  • WebRTC Encryption                        │
│  • TURN/STUN Servers                        │
│  • Cloud Recording Security                 │
│  • Meeting Token Validation                 │
└─────────────────────────────────────────────┘
```

## 📊 State Machine

```
                    [Initial State]
                          │
                          │ Click Mic Button
                          ▼
                    [Connecting]
                    isConnecting=true
                          │
                          │ API Success & Join Room
                          ▼
                    [Connected]
                    isConnected=true
                          │
         ┌────────────────┴────────────────┐
         │                                 │
    User Speaks                       AI Speaks
         │                                 │
         ▼                                 ▼
   [User Speaking]                  [AI Speaking]
   isSpeaking=true                  isAISpeaking=true
   Pulse Animation                  Waveform Animation
         │                                 │
         └────────────────┬────────────────┘
                          │
                          │ Both Stop
                          ▼
                    [Listening]
                    isConnected=true
                    isSpeaking=false
                    isAISpeaking=false
                          │
                          │ Click End
                          ▼
                    [Disconnected]
                    Reset All States
                          │
                          │ Loop back
                          ▼
                    [Initial State]
```

## 🎨 CSS Animation Pipeline

```
User Speaks
   │
   └─► Active Speaker Detected
        │
        └─► Apply "pulse-animation" class
             │
             └─► CSS Keyframes: pulse-glow
                  │
                  ├─► 0%: box-shadow 0 0 0 0 (collapsed)
                  │
                  ├─► 50%: box-shadow 0 0 0 20px (expanded)
                  │
                  └─► 100%: box-shadow 0 0 0 0 (collapsed)
                       │
                       └─► Loop: 2s infinite

AI Speaks
   │
   └─► Render Waveform Bars (5 bars)
        │
        └─► Apply "wave-bar" class to each
             │
             └─► CSS Keyframes: wave
                  │
                  ├─► 0%: scaleY(0.5) - short
                  │
                  ├─► 50%: scaleY(1.0) - tall
                  │
                  └─► 100%: scaleY(0.5) - short
                       │
                       └─► Loop: 1s infinite
                            │
                            └─► Staggered delays:
                                 Bar 1: 0s
                                 Bar 2: 0.1s
                                 Bar 3: 0.2s
                                 Bar 4: 0.3s
                                 Bar 5: 0.4s
```

## 🔌 API Integration

### Request Structure

```typescript
interface PipecatRequest {
  createDailyRoom: boolean;
  dailyRoomProperties: {
    enable_recording: "cloud" | "local" | "off";
    privacy: "public" | "private";
  };
  dailyMeetingTokenProperties: {
    is_owner: boolean;
    room_name?: string;
    user_name?: string;
  };
}
```

### Response Structure

```typescript
interface PipecatResponse {
  room_url: string;           // Daily.co room URL
  token: string;              // Meeting join token
  config: {
    bot_name?: string;
    language?: string;
    // Additional configuration
  };
}
```

## 🚀 Performance Optimization

```
┌─────────────────────────────────────────────┐
│         Optimization Strategies             │
│                                             │
│  1. Single-Flight Lock                      │
│     • Prevents duplicate API calls          │
│     • Uses useRef for instant check         │
│                                             │
│  2. Event Listener Optimization             │
│     • Cleanup on unmount                    │
│     • Efficient state updates               │
│                                             │
│  3. Conditional Rendering                   │
│     • Only show relevant UI                 │
│     • Reduce DOM size                       │
│                                             │
│  4. CSS Animations                          │
│     • GPU-accelerated transforms            │
│     • Avoid layout recalculation            │
│                                             │
│  5. Auto-scroll Optimization                │
│     • Smooth behavior                       │
│     • useEffect with dependencies           │
│                                             │
│  6. State Batching                          │
│     • React 18 automatic batching           │
│     • Efficient re-renders                  │
└─────────────────────────────────────────────┘
```

## 📱 Responsive Architecture

```
Mobile (< 768px)
   │
   ├─► Full-width card
   ├─► Stacked layout
   ├─► Larger touch targets
   └─► Simplified transcript view

Tablet (768px - 1024px)
   │
   ├─► max-w-2xl card
   ├─► Two-column where possible
   └─► Optimized spacing

Desktop (> 1024px)
   │
   ├─► max-w-4xl card
   ├─► Centered layout
   ├─► Background image visible
   └─► Full feature set
```

---

This architecture ensures scalability, maintainability, and excellent user experience! 🏗️✨
