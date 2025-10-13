# Launch Screen Background Music

## Required File

Place a background music file here named: **`launch-music.mp3`**

### Specifications

- **Format**: MP3
- **Duration**: 30-60 seconds (loops automatically)
- **Volume**: Will be set to 30% automatically
- **Type**: Professional, uplifting, corporate launch music
- **Size**: Keep under 1MB for fast loading

### Recommended Free Sources

1. **Pixabay Music** - https://pixabay.com/music/
   - Search: "uplifting corporate" or "technology intro"
   - 100% free, no attribution required

2. **Free Music Archive** - https://freemusicarchive.org
   - Filter by: Commercial use allowed

3. **YouTube Audio Library** - https://www.youtube.com/audiolibrary
   - Filter: No attribution required

4. **Incompetech** - https://incompetech.com
   - Kevin MacLeod's music (requires attribution)

### Search Terms

- "Corporate launch music"
- "Professional opener"
- "Uplifting corporate"
- "Technology intro"
- "Business presentation"
- "Inspiring corporate"

### Quick Setup Option

**Option 1 - Download from Pixabay:**
```bash
# Visit: https://pixabay.com/music/search/corporate%20uplifting/
# Download any track, rename to launch-music.mp3
# Place in this directory
```

**Option 2 - Use silence (for testing):**
If you don't have music yet, the app will work fine without it!
The audio button will automatically hide if the file is not found.

### Implementation Details

- ✅ Music starts automatically when user advances to stage 1
- ✅ Auto-play is handled gracefully with fallback
- ✅ Music button only appears if file is successfully loaded
- ✅ Users can mute/unmute using the button in the top-right corner
- ✅ Music loops until the user exits the launch screen
- ✅ Starts muted by default to respect user preferences

### Current Status

**Audio is optional** - The launch screen works perfectly without music!
