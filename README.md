# 🔥 InnerFire — Spatial Journaling for Snap Spectacles

**InnerFire** is a real-time XR journaling experience where users create logs through mindful breathing, reflection, and voice journaling, which fuel a persistent, interactive flame. The flame adapts and evolves across sessions, encouraging repeat use and emotional reflection.

🔗 [Portfolio Site (Design, Media, Process)](https://d4xr.notion.site/Team-4-Neon-Panda-Pack-1ee2fe62373680aa9b11e6580f9a62b9) 

💛 [Launch the Lens](https://www.spectacles.com/lens/4b75bc71480e4ac2bd81de92b42f55e8?type=SNAPCODE&metadata=01)

👉 [Watch the demo on YouTube](https://www.youtube.com/watch?v=MaDyfua4cXI)

## 🛠 System Overview

InnerFire was built for **Snap Spectacles (5th Edition, 2024)** using **Lens Studio v5.9.1**, with all functionality running entirely on-device. Gesture tracking, voice input, spatial anchoring, and state persistence are handled natively.

### Core Features

- **Gesture-based interaction** using the **Spectacles Interaction Kit**, with `Interactable` components mapped to log selection
- **Voice journaling** activated through anchored interaction; recordings are session-scoped and locally managed
- **Camera-relative flame anchoring**, with Snap’s tracking system and depth estimation for spatial consistency
- **Persistent local state**, using Lens Studio’s internal storage API to track engagement and evolve flame behavior

## 📁 Project Structure
```
spectacles-inner-fire/
├── Assets/
│ ├── Scripts/
│ │ ├── AttachToObjectTracking.js # Anchors flame using tracked surfaces
│ │ ├── ActivateMicrophoneRecorder.ts # Links gesture events to microphone input
│ │ └── MicrophoneRecorder.ts # Handles start/stop logic for audio recording
│ ├── Visuals/
│ ├── Audio/
│ └── Materials/
├── InnerFireNew.esproj # Main Lens Studio project file
├── jsconfig.json, tsconfig.json # TypeScript/JavaScript environment config
```

## 👥 Contributors

InnerFire was concepted and designed collaboratively by **Sai Saran Grandhe**, **David Madey**, **Shawn Smith**, **Anastasia Sotiropoulos**, and **Victor Chen** as part of team Neon Panda Pack.

All technical implementation was led and executed by **Victor Chen**, including:

- Implemented world-anchored flame placement using tracked surfaces and spatial logic  
- Designed and built interaction UI with camera-relative layout and gesture triggers  
- Developed gesture-based log creation via the Spectacles Interaction Kit  
- Integrated microphone input for session-based voice journaling  
- Enabled persistent local storage to track flame state across sessions  
