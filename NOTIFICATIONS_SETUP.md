# 📱 Push Notifications Setup Guide

## Current Status ✅

Your app already has all dependencies installed:
- ✅ `expo-notifications` (~55.0.13)
- ✅ `expo-dev-client` (~55.0.18)
- ✅ Smart Expo Go detection in `notificationService.ts`
- ✅ EAS development build profile configured

## The Issue 🚫

**Notifications DON'T work in Expo Go** (since SDK 53+)
- Expo Go doesn't support native notification modules
- Push token requests hang/fail in Expo Go
- BUT your code already handles this gracefully! (notificationService.ts:5-6)

## Two Solutions

### Solution 1: Quick Testing (Recommended for Dev) 🟢

**Use Expo Go + Local Notifications Only:**
- Already implemented in your code
- No new build needed
- Perfect for testing UI/UX
- Local notifications appear in dev

**Usage:**
```bash
npm start
# Scan QR with Expo Go
# Local notifications will work, push tokens will be skipped
```

See logs:
```
ℹ️ Push notifications are not available in Expo Go. Use a development build for full functionality.
```

---

### Solution 2: Full Push Notifications (Production-Ready) 🔴

**Build your own development client with notifications:**

#### Step 1: Install EAS CLI (if not already)
```bash
npm install -g eas-cli
eas login
```

#### Step 2: Build using EAS
```bash
# For Android
eas build --profile development --platform android

# For iOS (requires Apple account)
eas build --profile development --platform ios

# Install the downloaded APK on your device
```

#### Step 3: Run your app with development client
```bash
npm start
# Scan QR - opens your custom development client instead of Expo Go
# Push notifications now fully work!
```

---

## Code Implementation Details

### Smart Expo Go Detection (Already in Place ✅)

**File:** `lib/notificationService.ts`

```typescript
// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Skip notifications gracefully in Expo Go
if (isExpoGo) {
  console.log('ℹ️ Push notifications are not available in Expo Go...');
  return null;
}
```

**Benefits:**
- No crashes or warnings in Expo Go
- Graceful fallback for testing
- Ready for production build

---

## Permissions Configuration ✅

**Already configured in `app.json`:**

```json
"android": {
  "permissions": [
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.MODIFY_AUDIO_SETTINGS",
    "android.permission.RECEIVE_BOOT_COMPLETED",
    "android.permission.VIBRATE"
  ]
}
```

```json
"ios": {
  "infoPlist": {
    "UIBackgroundModes": ["remote-notification"]
  }
}
```

---

## Testing Checklist

### Dev Testing (Expo Go)
- [ ] `npm start` works
- [ ] Scan QR with Expo Go
- [ ] No crashes or warnings
- [ ] UI renders correctly
- [ ] Local notifications appear

### Production Testing (Development Build)
- [ ] Run `eas build --profile development --platform android`
- [ ] Download and install APK
- [ ] App opens successfully
- [ ] Push notifications can be registered
- [ ] Permission request appears on first launch

---

## Troubleshooting

### Issue: "Constants.appOwnership is undefined"
**Solution:** Ensure `expo-constants` is imported
```typescript
import Constants from 'expo-constants';
```

### Issue: EAS build fails
**Solution:** Check you're logged in
```bash
eas whoami
eas login
```

### Issue: Push tokens still request in Expo Go
**Solution:** The code already handles this - logs a message and returns null
```typescript
if (isExpoGo) {
  return null; // Gracefully skip
}
```

### Issue: Notifications don't appear on Android
**Solution:** Make sure notification channel is configured
```typescript
await Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
});
```

---

## Next Steps

1. **Immediate (Testing):** Keep using `npm start` + Expo Go for UI testing
2. **Before Production:** Build development client with `eas build --profile development`
3. **For Production Release:** Use `eas build --profile production`

Your EAS configuration already supports all three! Check `eas.json` for details.

---

## References

- [Expo Notifications Docs](https://docs.expo.dev/guides/push-notifications/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Go Limitations](https://docs.expo.dev/build/setup/#expo-go-limitations)

