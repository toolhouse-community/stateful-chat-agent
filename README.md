# Stateful Chat Agent

A powerful stateful AI chat application built with [Toolhouse](https://toolhouse.ai) that maintains persistent conversations and provides intelligent responses across multiple chat sessions.

## Overview

This app shows you how to create an agent that remembers conversations with its users. Unlike stateless chatbots that forget everything after each interaction, this agent maintains a persistent memory, allowing for more natural, context-aware conversations that build over time. This memory does not expire, and each conversation can be as long as the context window supported by the model you wish to use (1M tokens by default.)

To create stateful agents, you would usually need to set up your own database storage. Because we built the agent using Toolhouse, your app will have this capability out of the box. This means your agents are capable of remembering any conversation with any user with no additional integration needed.

💡 This app is the same app that powers the [Toolhouse Help Agent](https://help.toolhouse.ai)! Feel free to make it yours.

## Key Features

### Persistent Memory
The agent remembers previous conversations, user preferences, and context, creating a more personalized and intelligent experience.

### Conversation Continuity  
Chat history is automatically saved and can be retrieved, allowing users to return to previous discussions or reference past interactions.

### Tool Integration
Built on Toolhouse's platform, the agent can access a wide variety of pre-built tools and APIs to accomplish real-world tasks.

### Cross-Session State Management
State is maintained across different chat sessions, ensuring the agent remembers important information even after restarts.

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Toolhouse account and API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/toolhouse-community/stateful-chat-agent.git
cd stateful-chat-agent
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables by creating a `.env` file:
```bash
VITE_TOOLHOUSE_BEARER_TOKEN=your_toolhouse_bearer_token
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Usage

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to the URL shown by your terminal.

The application will:
1. **First interaction**: Create a new session (POST) and receive a session ID
2. **Ongoing chats**: Update the session (PUT) with each interaction
3. **Page refreshes**: Retrieve previous session (GET) to continue conversations


How Statefulness Works
This agent achieves statefulness through Toolhouse's built-in session management system using HTTP headers and REST operations:

### Session Creation (POST Request)
When starting a new conversation, the agent makes a POST request to the Toolhouse agent. The response includes this header:
```
x-toolhouse-run-id: <unique-session-identifier>
```
This `x-toolhouse-run-id` header contains a unique session identifier that serves as the key for all subsequent stateful operations.

### Session Updates (PUT Request)
To add new information to an existing session, the agent uses PUT requests with the session ID:
```http
PUT https://agents.toolhouse.ai/$AGENT_ID/$RUN_ID

{"message": "thank you! now, can you send me an email with a summary of our conversation?"}
```
This allows the agent to continuously build and update the conversation state, storing:
- User messages and agent responses
- MCP Server execution results
- Context and preferences

### Session Retrieval (GET Request)
This app has been built to retrieve a conversation history every time you navigate /$RUN_ID with a valid run id ([example](https://help.toolhouse.ai/16ac69eb-130e-45b7-bbe3-927a13d79350)). As you will notice, we don't use databases, and we just rely on the Toolhouse state manager.

To retrieve previous conversation state, the app will make this GET requests:
```http
GET https://agents.toolhouse.ai/$AGENT_ID/$RUN_ID
```
This returns the complete session state, allowing the agent to resume conversations with full context.

**Important**: Sessions in Toolhouse **do not expire**. This means users can return to any previous conversation threads and even add to past conversations if you wish to do so. In this app, we implemented logic to **disable** the ability to continue conversations.

### State Management Flow
```
1. Initial Conversation
   POST https://agents.toolhouse.ai/$AGENT_ID → Toolhouse returns x-toolhouse-run-id (or $RUN_ID from now on)

2. Ongoing Conversation  
   PUT https://agents.toolhouse.ai/$AGENT_ID/$RUN_ID → Updates session with new messages/context
   
3. Resume Conversation
   GET https://agents.toolhouse.ai/$AGENT_ID/$RUN_ID → Retrieves full session history
   PUT https://agents.toolhouse.ai/$AGENT_ID/$RUN_ID → Continues adding to existing session
```

## Architecture

```
User Input → Agent Processing → Toolhouse Session Management
     ↑                                      ↓
     ←←←←←← Response ←←←←← Tool Execution ←←←←
                              ↓
                     Session State (Permanent)
                   POST: Create (x-toolhouse-run-id)
                   PUT:  Update session
                   GET:  Retrieve session
```

## Use Cases

This stateful chat agent is perfect for:

- **Personal assistants** that learn user preferences over time
- **Customer support** agents that remember previous interactions
- **Educational tutors** that track learning progress
- **Project management** assistants that maintain task context
- **Research assistants** that build knowledge over sessions

## Toolhouse Integration

This project showcases the power of [Toolhouse](https://toolhouse.ai) for building stateful AI agents. Toolhouse provides:

- **Easy tool integration** - Access 100+ pre-built tools in just 3 lines of code
- **State management** - Built-in persistence and memory capabilities  
- **Multi-LLM support** - Works with any LLM provider
- **Production-ready** - Robust error handling and infrastructure

## Contributing

We welcome contributions to improve this stateful chat agent! Please feel free to:

- Report bugs or suggest features
- Submit pull requests
- Share your own stateful agent implementations
- Contribute to the Toolhouse community

## Community

Join the Toolhouse community:
- [Discord](https://discord.toolhouse.ai)
- [Documentation](https://help.toolhouse.ai)
- [Sign up](https://join.toolhouse.ai)

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using [Toolhouse](https://toolhouse.ai) - Connect AI to the real world.**