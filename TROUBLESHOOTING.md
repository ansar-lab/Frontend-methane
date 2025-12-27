# 🔧 Farm Vaidya - Troubleshooting Guide

## Common Issues and Solutions

### 🎤 Microphone Issues

#### Problem: "Microphone permission denied"
**Symptoms:**
- Browser shows blocked microphone icon
- No audio detected
- Connection fails

**Solutions:**
1. **Chrome/Edge:**
   - Click the lock icon in address bar
   - Change microphone to "Allow"
   - Reload the page

2. **Firefox:**
   - Click the shield/lock icon
   - Permissions → Microphone → Allow
   - Reload the page

3. **Safari:**
   - Safari → Settings → Websites → Microphone
   - Find localhost → Allow
   - Reload the page

4. **System Level (Windows):**
   ```
   Settings → Privacy → Microphone
   - Enable "Let apps access your microphone"
   - Enable for browser
   ```

#### Problem: "Microphone works but no speech detected"
**Solutions:**
1. Check system microphone is not muted
2. Speak closer to microphone
3. Increase microphone volume in system settings
4. Test microphone in other apps first
5. Try a different microphone/headset

---

### 🔌 Connection Issues

#### Problem: "Failed to connect" / "Connection error occurred"
**Symptoms:**
- Button shows "Connecting..." indefinitely
- Toast shows error message
- Console shows API errors

**Solutions:**

1. **Check Internet Connection:**
   ```powershell
   # Test connectivity
   ping api.pipecat.daily.co
   ```

2. **Verify API Token:**
   - Check token is correct in VoiceAgent.tsx
   - Token format: `pk_...` (starts with pk_)
   - No extra spaces or characters

3. **Check Browser Console:**
   ```javascript
   // Look for these errors:
   - "API request failed"
   - "Network error"
   - "CORS error"
   ```

4. **Try Different Browser:**
   - Chrome (recommended)
   - Edge
   - Firefox

5. **Clear Browser Cache:**
   ```
   Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload page
   ```

6. **Disable Browser Extensions:**
   - Ad blockers may interfere
   - VPNs may cause issues
   - Privacy extensions

#### Problem: "Connection drops frequently"
**Solutions:**
1. Check WiFi signal strength
2. Close bandwidth-heavy applications
3. Try wired connection if available
4. Reduce distance from router
5. Check Daily.co service status

---

### 🔊 Audio Issues

#### Problem: "Can't hear AI speaking"
**Symptoms:**
- Waveform appears but no sound
- AI seems to be speaking (visual indicator)
- User can speak but no response heard

**Solutions:**

1. **Check System Volume:**
   - Windows volume mixer
   - Unmute browser
   - Check speaker/headphone connection

2. **Check Browser Audio:**
   - Right-click browser tab
   - Check if tab is muted
   - Unmute if necessary

3. **Check Audio Output Device:**
   ```
   Windows Settings → Sound
   - Verify correct output device
   - Test speakers
   ```

4. **Try Different Browser:**
   - Some browsers have audio issues
   - Chrome generally most reliable

5. **Check Daily.co Audio:**
   - Open browser console
   - Type: `callFrame.participants()`
   - Check if audio track exists

#### Problem: "Echo or feedback during conversation"
**Solutions:**
1. Use headphones instead of speakers
2. Reduce system volume
3. Increase distance between mic and speakers
4. Use push-to-talk (mute/unmute)
5. Check for multiple browser tabs with same page

---

### 💬 Transcript Issues

#### Problem: "Transcript not updating"
**Symptoms:**
- No messages appearing
- Transcript section empty
- Conversation works but no visual record

**Current Limitation:**
The transcript feature shows simulated messages. Real speech-to-text requires additional integration.

**To Add Real Transcription:**
1. Integrate with speech-to-text API
2. Process audio chunks
3. Update transcript in real-time

**Workaround:**
Monitor conversation through:
- Visual indicators (waveform, pulse)
- Status text updates
- Audio feedback

#### Problem: "Transcript not scrolling"
**Solutions:**
1. Check if transcript has content
2. Manually scroll to verify
3. Check browser console for errors
4. Transcript should auto-scroll to bottom

---

### 🎨 UI/Visual Issues

#### Problem: "Pulse animation not working"
**Symptoms:**
- Microphone button doesn't pulse
- No visual feedback when speaking
- Static button appearance

**Solutions:**

1. **Check CSS Loading:**
   - Open DevTools → Network
   - Verify index.css loaded
   - Check for 404 errors

2. **Verify Animation Class:**
   ```javascript
   // Browser console:
   document.querySelector('.pulse-animation')
   // Should return element when speaking
   ```

3. **Check Speaking Detection:**
   ```javascript
   // In VoiceAgent.tsx, add console.log:
   console.log('isSpeaking:', isSpeaking);
   ```

4. **Clear Browser Cache:**
   - CSS changes may be cached
   - Hard reload: Ctrl+Shift+R

#### Problem: "Waveform not appearing for AI"
**Solutions:**
1. Check `isAISpeaking` state
2. Verify CSS animation loaded
3. Check browser console for errors
4. Inspect element to verify classes applied

#### Problem: "Background image not showing"
**Solutions:**
1. Check image URL is accessible
2. Verify opacity is set (0.2)
3. Check network tab for 404 error
4. Try different image URL

---

### 🔐 Build/Deployment Issues

#### Problem: "npm install fails"
**Solutions:**

1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

2. **Check Node version:**
   ```powershell
   node --version  # Should be 18 or higher
   npm --version   # Should be 9 or higher
   ```

3. **Use compatible versions:**
   ```powershell
   # Update Node if needed
   # Download from nodejs.org
   ```

#### Problem: "Build fails / TypeScript errors"
**Solutions:**

1. **Check for type errors:**
   ```powershell
   npx tsc --noEmit
   ```

2. **Common fixes:**
   - Add missing type definitions
   - Install @types packages
   - Fix import statements

3. **Clear build cache:**
   ```powershell
   rm -rf dist
   rm -rf .vite
   npm run build
   ```

#### Problem: "Production build not working"
**Solutions:**

1. **Check environment variables:**
   ```javascript
   // Create .env.production
   VITE_PIPECAT_TOKEN=your_token_here
   ```

2. **Verify build output:**
   ```powershell
   npm run build
   # Check dist folder created
   npm run preview
   # Test build locally
   ```

3. **Check deployment platform:**
   - Vercel: Add environment variables
   - Netlify: Configure _redirects
   - GitHub Pages: Use HashRouter

---

### 📱 Mobile/Responsive Issues

#### Problem: "App doesn't work on mobile"
**Solutions:**

1. **Check HTTPS:**
   - Mobile requires HTTPS for microphone
   - Use ngrok for local testing
   - Deploy to HTTPS server

2. **Check mobile browser:**
   - Safari on iOS
   - Chrome on Android
   - Update to latest version

3. **Check microphone permission:**
   - Mobile settings → Browser → Permissions
   - Allow microphone access

4. **Test responsive layout:**
   - Check viewport meta tag
   - Test different screen sizes
   - Verify touch targets are large enough

---

### 🐛 Debugging Tools

#### Browser Console Commands:

```javascript
// Check connection state
console.log(callFrame?.meetingState());

// List participants
console.log(callFrame?.participants());

// Check local audio
console.log(callFrame?.participants().local.audio);

// Get meeting info
console.log(callFrame?.properties);

// Force leave
callFrame?.leave();
```

#### React DevTools:
1. Install React DevTools extension
2. Inspect VoiceAgent component
3. Check state values in real-time
4. Verify props passing correctly

#### Network Inspection:
1. Open DevTools → Network
2. Filter: Fetch/XHR
3. Look for Pipecat API call
4. Check request/response
5. Verify status codes

---

### 🚨 Emergency Reset

If nothing else works, try this complete reset:

```powershell
# 1. Stop dev server
# Press Ctrl+C in terminal

# 2. Clean everything
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm package-lock.json

# 3. Reinstall
npm install

# 4. Restart
npm run dev

# 5. Hard reload browser
# Ctrl+Shift+R (Windows)
# Cmd+Shift+R (Mac)
```

---

### 📊 Performance Issues

#### Problem: "App is slow/laggy"
**Solutions:**

1. **Check CPU usage:**
   - Close other applications
   - Limit browser tabs
   - Check background processes

2. **Optimize animations:**
   - Reduce animation complexity
   - Disable non-essential effects
   - Use will-change CSS property

3. **Check memory:**
   - Browser DevTools → Performance
   - Look for memory leaks
   - Properly cleanup event listeners

4. **Network optimization:**
   - Use faster internet connection
   - Reduce concurrent connections
   - Check bandwidth usage

---

### 🔍 Getting More Help

#### Check Logs:

**Browser Console:**
```javascript
// Enable verbose logging
localStorage.debug = '*';
location.reload();
```

**Daily.co Logs:**
```javascript
// In VoiceAgent.tsx
frame.setLogLevel('debug');
```

#### Report Issues:

When reporting issues, include:
1. Browser name and version
2. Operating system
3. Error messages from console
4. Steps to reproduce
5. Screenshots if applicable

#### Resources:

- **Daily.co Documentation:** https://docs.daily.co/
- **Pipecat Support:** https://www.pipecat.ai/support
- **React Documentation:** https://react.dev/
- **WebRTC Troubleshooting:** https://webrtc.org/

---

### ✅ Testing Checklist

Before deploying, verify:

- [ ] Microphone permission granted
- [ ] Connection establishes successfully
- [ ] User speaking detected (pulse animation)
- [ ] AI speaking detected (waveform)
- [ ] Audio output working
- [ ] Mute/unmute functioning
- [ ] Transcript updating
- [ ] End conversation works
- [ ] Reconnection works
- [ ] Mobile responsive
- [ ] HTTPS in production
- [ ] API token configured
- [ ] Error handling working
- [ ] Toast notifications appearing
- [ ] Console has no errors

---

## 💡 Pro Tips

1. **Always test in incognito mode** to rule out extension issues
2. **Use Chrome DevTools mobile emulator** for responsive testing
3. **Keep browser console open** during testing
4. **Test with different microphones** to verify compatibility
5. **Use network throttling** to test slow connections
6. **Check Daily.co dashboard** for usage metrics
7. **Monitor API rate limits** to avoid service interruption
8. **Set up error tracking** (Sentry) for production
9. **Use source maps** for easier debugging
10. **Keep dependencies updated** for security and bug fixes

---

**Still having issues?** Check the browser console first - it usually tells you exactly what's wrong! 🔍

**Need more help?** Review FEATURES.md and ARCHITECTURE.md for deeper technical details.
