# AI Chat Game Prototype

This is a lightweight mobile prototype of a real-time, mixed human-AI chat game, built as a take-home assessment. It demonstrates dynamic lobby creation, live chat using WebSockets, and AI chatbot interaction using the OpenAI API. The prototype is built in React Native and packaged as an Android APK.

## 🧩 What It Does

- Users can create or join public/private lobbies.
- Lobbies support unlimited users and configurable AI participants.
- Real-time chat is powered via WebSockets.
- ChatGPT bots (via OpenAI API) respond to messages contextually within each lobby.
- Every N messages, a simple game event (e.g., a trivia prompt) is injected to simulate future extensibility into games.

## ⚙️ Architecture (see AI Chat Architecture.png)

1. **Client (Expo React Native)**  
   Handles UI, navigation, and socket communication. Manages local state, message display, and triggering AI/game events.

2. **Server (Node.js + Socket.IO)**  
   - Manages lobby state and message broadcasting.
   - Handles client connections and disconnections.
   - Relays chat to OpenAI and injects game events periodically.
   - server deployed on Render.

3. **AI Integration**  
   - OpenAI's ChatGPT API is used for AI responses.
   - Bots are instantiated per lobby with their own names/avatars.
   - Response streaming is supported (if enabled by token-level streaming).

## 🛠️ Tech Stack

| Layer       | Technology                  |
|------------|-----------------------------|
| Mobile UI   | React Native (Expo)         |
| Realtime    | Socket.IO w/ Render(Client + Server) |
| Backend     | Node.js                     |
| AI Service  | OpenAI Chat Completion API  |

## 💬 Prompt Strategy

- Each AI message uses the full recent chat context (with limit).
- Prompts begin with an instruction defining the bot’s personality and role.
- System message: `"You are a funny and witty game participant named QuizBot. Always respond quickly and playfully."`

**Rate limiting:**  
Basic in-memory throttle (per lobby) to limit one bot message per 3 seconds. Future work should include per-IP rate limits and context window management.

## 🚀 Setup & Build Instructions

### 🔧 Local Dev

**1. Clone Repository**
```bash
git clone https://github.com/your-username/ai-chat-game.git
cd ai-chat-game
cd app
npm install

**2. Start development Server**
npx expo start
cd app
eas build -p android --profile preview

**3. Build APK**
cd app
eas build -p android --profile preview
