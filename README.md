# AI Trivia Chat Lobby App

A real-time multiplayer chat lobby where human users interact with AI-driven trivia bots through WebSocket communication. AI responses are streamed incrementally for a live chat experience.

---

Architecture Diagram
----------------------
-see diagram.png

Tech Stack & Libraries
----------------------
Frontend:
- React Native (Expo)
- TypeScript
- React Hooks (useState, useEffect)

Backend:
- Node.js with Express.js (Deployed on Render)
- Socket.IO for real-time communication
- OpenAI Node SDK (Chat Completions API with Streaming)

Key Libraries:
- expo-router for navigation
- Socket.IO client
- FlatList for efficient message rendering
- ActivityIndicator for typing indicators during AI streaming

---

Prompt Strategy & Rate-Limit Handling
-------------------------------------
Each bot has a unique system prompt that defines its persona:
- TriviaMaster Bot: Witty trivia host.
- FriendlyHelper Bot: Encouraging assistant.
- SarcasticBot: Humorous and cheeky responses.

The prompt strategy involves sending the system prompt followed by the user's message per interaction to maintain bot personality.

Streaming is handled token-by-token using OpenAI’s streaming API.
- aiChunk events are emitted for each new token.
- On the client, a loading spinner (ActivityIndicator) is displayed while the message is being streamed.
- Bot spawn limits are enforced per lobby to prevent excessive AI instances.
- The Render deployment ensures the backend remains continuously accessible without requiring local server management.

---

Build & Run Instructions
------------------------
Backend (Render Deployment):
- The backend server is deployed on Render.
- The Socket.IO server URL is configured in the frontend to point to the Render WebSocket endpoint (e.g., wss://your-app-name.onrender.com).

Backend (Local):
1. clone the repository
2. navigate to backend directory
3. install dependencies:
    npm install
4. start the server locally:
    npm start (or node server.js)

Frontend (Expo React Native App):
1. Clone the repository.
2. Navigate to frontend directory.
3. Install dependencies:
   npm install
4. confirm that the Socket.IO client to connect to the Render deployment URL.
5. Start Expo:
   npm start
6. Open in Expo Go or emulator.
7. Build APK (optional):
    eas build --profile preview --platform android

--you can also just install the apk file:--
 https://expo.dev/accounts/nolh1/projects/AIChatGameProject/builds/286252d9-3a88-4e16-9d5f-55fa9692507f

---

Known Limitations & Future Work
-------------------------------
- No database persistence: Future work will integrate Firestore or MongoDB.
- AI message rate-limiting is not enforced yet.
- Currently only supports cheaper model GPT-3.5-Turbo. Future upgrade to support GPT-4.
- Basic UI/UX: Future plans include adding avatars, chat bubble animations, and enhanced bot visuals.
- No error feedback for API quota limits.
- Single-instance backend; for production, scalability improvements like Render autoscaling or a managed WebSocket service will be considered.

