# 3D-AI-Avatar

Emotion-driven Three.js AI Avatar

7. Example Input & Output

Input (Frontend Speech):

"I'm feeling energetic today! Let's run around!"

Backend Output (JSON):

{
  "actions": [
    {"type": "animation", "value": "Run"},
    {"type": "color", "value": 16711680},
    {"type": "speech", "value": "I feel energetic too!", "emotion": "excited"}
  ]
}

Frontend Behavior:

Avatar starts running animation
Changes color to red
Speaks the text with excited voice modulation

Loads .glb model
Stores animations in actions
Sets up AnimationMixer for animation playback
Animation System
All animations are controllable dynamically
Play, stop, and reset animations based on AI input
Handles multiple clips from the GLTF model
Facial Expressions
Supports morph target-based expressions
Dynamically adjusts expressions like angry, surprised via morphTargetInfluences
Emotion-Aware Voice Output
Uses SpeechSynthesisUtterance to speak text
Emotion affects rate, pitch, and tone of speech


Loads .glb model
Stores animations in actions
Sets up AnimationMixer for animation playback
Animation System
All animations are controllable dynamically
Play, stop, and reset animations based on AI input
Handles multiple clips from the GLTF model
Facial Expressions
Supports morph target-based expressions
Dynamically adjusts expressions like angry, surprised via morphTargetInfluences
Emotion-Aware Voice Output
Uses SpeechSynthesisUtterance to speak text
Emotion affects rate, pitch, and tone of speech



4. Data Flow
User speaks into the microphone
Frontend captures speech → converts to text
Text is sent via POST to FastAPI backend
Backend updates EmotionState → maps to avatar actions
JSON response is returned
Frontend applies:
Animation
Facial expression
Color changes
Speech synthesis
5. Deployment
Frontend: Can be deployed on Vercel or static hosting
Backend: Hosted with FastAPI via Vercel serverless functions or Heroku/Render
GitHub integration allows CI/CD for automatic deployment
6. Key Technical Notes
GLTF/GLB files must contain animations and morph targets for proper avatar response
Ensure CORS is handled if frontend and backend are on separate domains
Clock / Timer: use THREE.Clock() instead of deprecated THREE.Timer()
Microphone access requires HTTPS in production
actions mapping is fully dynamic and extensible:
animation, color, facial_expression, speech
7. Example Input & Output

Input (Frontend Speech):

"I'm feeling energetic today! Let's run around!"

Backend Output (JSON):

{
  "actions": [
    {"type": "animation", "value": "Run"},
    {"type": "color", "value": 16711680},
    {"type": "speech", "value": "I feel energetic too!", "emotion": "excited"}
  ]
}

Frontend Behavior:

Avatar starts running animation
Changes color to red
Speaks the text with excited voice modulation

This gives a full picture of the project, from 3D rendering to AI-driven emotion handling, including animation, expressions, color, and voice integration.

This gives a full picture of the project, from 3D rendering to AI-driven emotion handling, including animation, expressions, color, and voice integration.
