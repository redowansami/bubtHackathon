# Enhanced Chatbot API - Testing Guide

## Overview

The chatbot has been enhanced with 7 specialized endpoints, each handling different food-related topics with:
- **LLM-based reasoning** using OpenRouter AI (Grok 4.1)
- **Contextual memory** (in-memory session storage)
- **Prompt chaining** for multi-turn conversations
- **Knowledge base retrieval** with curated tips and data

---

## Endpoints

### 1. General Q&A (Stateless)
**POST** `/api/v1/chatbot/ask`

No session memory - quick answers.

**Request:**
```json
{
  "content": "How do I store fresh vegetables?",
  "enableReasoning": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "To store fresh vegetables properly...",
    "reasoning": null
  }
}
```

---

### 2. Food Waste Reduction
**POST** `/api/v1/chatbot/waste-reduction`

Expert advice on preventing food waste with session memory.

**Request:**
```json
{
  "content": "I keep throwing away vegetables. How can I prevent this?",
  "sessionId": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "answer": "Here are practical ways to reduce food waste:\n1. Proper storage techniques...",
    "reasoning": { "thinking": "..." }
  }
}
```

**Follow-up (uses same sessionId):**
```json
{
  "content": "What about herbs like basil?",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 3. Nutrition Balancing
**POST** `/api/v1/chatbot/nutrition`

Personalized nutrition advice with session memory.

**Request:**
```json
{
  "content": "I'm vegetarian. How do I get enough protein?",
  "sessionId": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "answer": "As a vegetarian, here are protein-rich foods and combinations...",
    "reasoning": null
  }
}
```

---

### 4. Budget Meal Planning
**POST** `/api/v1/chatbot/budget-meals`

Plan affordable meals with contextual awareness.

**Request:**
```json
{
  "content": "Plan a week of meals for $50",
  "sessionId": "optional-uuid",
  "context": {
    "budget": "$50/week",
    "familySize": 4,
    "dietaryRestrictions": ["gluten-free"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "answer": "Here's a budget meal plan for your family of 4...",
    "reasoning": null
  }
}
```

**Follow-up:**
```json
{
  "content": "What about proteins in this plan?",
  "sessionId": "same-uuid"
}
```
The chatbot remembers the context from previous messages!

---

### 5. Leftover Transformation Ideas
**POST** `/api/v1/chatbot/leftovers`

Creative recipes for leftover food with session memory.

**Request:**
```json
{
  "content": "I have leftover rice and cooked chicken"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "auto-generated-uuid",
    "answer": "Here are creative ways to transform your leftovers:\n1. Chicken Fried Rice...",
    "reasoning": null
  }
}
```

---

### 6. Food Sharing & Community
**POST** `/api/v1/chatbot/food-sharing`

Local food sharing resources and guidelines.

**Request:**
```json
{
  "content": "How can I share excess food with my community?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "answer": "Here are ways to share food in your community:\n1. OLIO app...",
    "reasoning": null
  }
}
```

---

### 7. Environmental Impact
**POST** `/api/v1/chatbot/environment`

Explanation of food's environmental impact.

**Request:**
```json
{
  "content": "What's the environmental impact of beef vs chicken?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "answer": "Beef has a significantly higher carbon footprint (~27kg CO2/kg) compared to chicken (~6kg CO2/kg)...",
    "reasoning": null
  }
}
```

---

### 8. General Food Advice
**POST** `/api/v1/chatbot/advice`

General food-related questions with full context.

**Request:**
```json
{
  "content": "Help me plan sustainable meals",
  "sessionId": "optional-uuid",
  "context": {
    "preferences": ["vegan", "local", "sustainable"],
    "budget": "$100/week"
  }
}
```

---

## Session Management

### Get Session History
**GET** `/api/v1/chatbot/sessions/:sessionId/history`

Retrieve all messages in a session (for UI or analysis).

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "history": [
      {
        "role": "user",
        "content": "First message...",
        "timestamp": "2025-11-21T10:00:00Z"
      },
      {
        "role": "assistant",
        "content": "Response...",
        "timestamp": "2025-11-21T10:00:05Z"
      }
    ]
  }
}
```

### Get Session Context
**GET** `/api/v1/chatbot/sessions/:sessionId/context`

Retrieve stored context for a session.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-here",
    "context": {
      "budget": "$50/week",
      "familySize": 4
    }
  }
}
```

### Clear Session
**DELETE** `/api/v1/chatbot/sessions/:sessionId`

Clear all messages in a session.

**Response:**
```json
{
  "success": true,
  "message": "Session cleared successfully"
}
```

---

## Postman Collection Examples

### Example 1: Multi-turn Waste Reduction Conversation

**Turn 1:**
```bash
curl -X POST http://localhost:5000/api/v1/chatbot/waste-reduction \
  -H "Content-Type: application/json" \
  -d '{
    "content": "How do I reduce food waste?",
    "sessionId": "session-123"
  }'
```

Response includes `sessionId: "session-123"`

**Turn 2 (uses same sessionId):**
```bash
curl -X POST http://localhost:5000/api/v1/chatbot/waste-reduction \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What about freezing food?",
    "sessionId": "session-123"
  }'
```

Chatbot remembers the context from Turn 1! (Prompt chaining)

### Example 2: Budget Meal Planning with Context

```bash
curl -X POST http://localhost:5000/api/v1/chatbot/budget-meals \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Plan meals for 2 people on a tight budget",
    "context": {
      "budget": "$30/week",
      "familySize": 2,
      "dietaryRestrictions": ["vegetarian"]
    }
  }'
```

---

## Key Features

### 1. Contextual Memory (Session Management)
- Each session maintains conversation history
- Context persists across messages
- Enables prompt chaining for multi-turn conversations
- Auto-cleanup of old sessions (24-hour threshold)

### 2. Knowledge Base Integration
Chatbot references curated tips for:
- **Waste Reduction:** 20+ tips on storage, shopping, freezing
- **Nutrition:** 12+ tips on balanced diet, proteins, vitamins
- **Budget Meals:** 16+ tips on affordable ingredients & meal prep
- **Leftovers:** 25+ creative recipe ideas by ingredient
- **Food Sharing:** Community resources and guidelines
- **Environment:** Carbon/water footprint data

### 3. Prompt Chaining (LLM Reasoning)
- System prompts guide the LLM for each category
- Conversation history included in every API call
- Model understands context from previous messages
- Enables natural multi-turn conversations

### 4. Flexible Context
Pass custom context for personalized advice:
```json
{
  "budget": "$100/week",
  "familySize": 4,
  "dietaryRestrictions": ["gluten-free", "vegan"],
  "allergies": ["peanuts"],
  "preferences": ["local", "organic"]
}
```

---

## Environment Setup

Add to `.env`:
```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
CHATBOT_MODEL=x-ai/grok-4.1-fast:free
```

---

## Testing Checklist

- [ ] Test `/ask` endpoint (stateless)
- [ ] Test `/waste-reduction` with multiple messages (same sessionId)
- [ ] Test `/nutrition` with dietary context
- [ ] Test `/budget-meals` with budget context
- [ ] Test `/leftovers` for creative recipe ideas
- [ ] Test `/food-sharing` for community resources
- [ ] Test `/environment` for impact data
- [ ] Test session history retrieval
- [ ] Test session context retrieval
- [ ] Test session clearing

---

## Architecture

```
Request → Route → Controller → Service
                                   ↓
                        SessionMemoryManager
                                   ↓
                        OpenRouter API
                                   ↓
                        Response + Context
```

Each conversation is isolated in memory but has access to knowledge base and AI reasoning.
