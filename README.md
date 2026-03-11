# RAG Customer Support Assistant

A **Retrieval-Augmented Generation (RAG)** based AI assistant that answers customer support questions using semantic search over embedded documentation.
The system retrieves the most relevant knowledge chunks and generates contextual answers using an **LLM**.

This project demonstrates a **full-stack RAG pipeline** including document chunking, embeddings, similarity search, and AI response generation.

## Demo Architecture

```
User Question
     ↓
Frontend (React + Vite)
     ↓
Backend API (Node.js + Express)
     ↓
Query Embedding
     ↓
Cosine Similarity Search
     ↓
Top-K Relevant Chunks
     ↓
LLM Response Generation
     ↓
Answer + Sources + Similarity Scores
```

## Tech Stack

Frontend
- React (Vite)
- TailwindCSS

Backend
- Node.js
- Express.js

AI / Retrieval
- Google Gemini API (Embeddings + Chat Completion)
- Cosine Similarity Search
- Chunked Document Retrieval

Deployment
- Netlify (Frontend)
- Render (Backend)

## Features

- Retrieval-Augmented Generation (RAG) pipeline
- Semantic search using vector embeddings
- Document chunking with overlap
- Cosine similarity ranking
- Top-K chunk retrieval
- AI-generated contextual answers
- Source transparency (retrieved documents shown)
- Similarity score debugging
- Session-based chat history
- Simple in-memory vector store

## Project Structure

```
genai-rag-assistant
│
├── backend
│   ├── src
│   │   ├── data
│   │   │   └── docs.json
│   │   ├── services
│   │   │   ├── embedder.js
│   │   │   ├── rag.js
│   │   ├── stores
│   │   │   ├── conversationStore.js
│   │   │   ├── vectorStore.js
│   │   ├── utils
│   │   │   ├── logger.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── timeouts.js
│   │   └── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── Chat.jsx
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## How the RAG Pipeline Works

### 1. Document Loading

Support documentation is stored in `docs.json`.

Example:

```json
{
  "title": "Refund Policy",
  "category": "Billing",
  "content": "Refunds are processed within 5–7 business days."
}
```

### 2. Document Chunking

Documents are split into smaller chunks with overlap to improve retrieval.

Example:

```js
chunk size = 200
overlap = 50
```

This ensures semantic continuity between chunks.

### 3. Embedding Generation

Each chunk is converted into a vector embedding using the Google Gemini GenerativeAI embedding model.

```
text → embedding vector
```

These embeddings are stored in an **in-memory vector store**.

### 4. Query Embedding

When the user asks a question:

```
User Question → Query Embedding
```

### 5. Similarity Search

Cosine similarity is used to find the most relevant chunks.

```
similarity = dot(A, B) / (|A| * |B|)
```

Top-K chunks are retrieved.

### 6. LLM Response Generation

The retrieved chunks are injected into the prompt as context:

```
Context:
[Top chunks]

Question:
User query
```

The LLM then generates the final answer.

## Example Response

```
User Question:
How long do refunds take?

Response:
Refunds are processed within 5–7 business days.

Sources:
Refund Policy (Billing) – 0.73 similarity
```

## Debug Mode

The frontend includes a debug mode that displays:
- Token usage
- Retrieved chunk count
- Similarity scores

This helps analyze retrieval quality.

## Running the Project Locally

### 1. Clone Repositories

Create a separate folder locally, then make sure you clone both the repositories below into that folder

```bash
git clone https://github.com/ManikantaPinabakala/rag-support-chatbot-frontend
git clone https://github.com/ManikantaPinabakala/rag-support-chatbot-backend
```

### 2. Backend Setup

```bash
cd rag-support-chatbot-backend
npm install
```

Create .env

```
GEMINI_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### 3. Frontend Setup

```bash
cd rag-support-chatbot-frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

## Deployment

Frontend<br/>Deployed on **Netlify**

Backend<br/>Deployed on **Render**

Environment variables are configured in the deployment dashboards.

## Limitations

- Uses an in-memory vector store
- Embeddings are regenerated on server restart
- Not designed for large-scale datasets

This project focuses on demonstrating **core RAG concepts rather than production scalability**.

## Future Improvements

- Persistent vector database (pgvector / Pinecone)
- Hybrid search (BM25 + embeddings)
- Streaming responses
- Better chunk ranking
- Document upload interface
- Conversation memory

## Learning Goals

This project demonstrates practical implementation of:
- Retrieval-Augmented Generation
- Embedding-based semantic search
- Vector similarity search
- LLM prompt grounding
- Full-stack AI application deployment
