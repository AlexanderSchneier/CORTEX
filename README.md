# CORTEX

**Your Intelligent Research Companion**

CORTEX is an AI-powered research assistant that helps users upload, analyze, and interact with academic papers. It combines seamless PDF management, retrieval-augmented generation (RAG), and multi-model chat capabilities within a clean, modern web interface.

---

## Overview

CORTEX allows users to upload research papers, query them using natural language, and receive citation-linked answers grounded in their uploaded documents. The system is designed for students, researchers, and professionals who want to save time digesting and comparing academic sources.

---

## Features

### Smart Paper Analysis

* Upload multiple research papers (PDFs) and have them automatically parsed and indexed.
* Ask natural language questions across your entire document library.
* Get answers supported by direct citations and page numbers.

### Interactive Chat Interface

* Chat conversationally with CORTEX about your uploaded documents.
* Switch between different large language models (e.g., GPT-4, Claude, Gemini).
* Citations in responses are clickable and jump directly to the referenced PDF page.

### Organized Workspaces

* Each upload session forms a workspace, grouping related documents.
* Every workspace maintains its own vector index and context memory.

### Authentication

* Secure JWT-based login and signup.
* Each user’s uploads, workspaces, and chat history are fully isolated.

### Integrated PDF Viewer

* Built-in React-PDF viewer with highlighting support.
* View, scroll, and reference PDFs directly in the app without downloading.
* Click on citations to navigate to the exact page mentioned.

---

## Tech Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| Frontend       | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Backend        | FastAPI (Python)                                 |
| Database       | MongoDB Atlas                                    |
| Authentication | JWT tokens (Cognito-ready)                       |
| File Storage   | AWS S3 (planned)                                 |
| AI Models      | OpenAI, Anthropic, Gemini APIs                   |
| Deployment     | Railway (FastAPI) + Vercel or Netlify (Next.js)  |

---

## Project Structure

```
CORTEX/
│
├── frontend/                # Next.js app
│   ├── components/          # Chatbot, PDF viewer, navigation, etc.
│   ├── app/                 # Pages and routes
│   ├── public/              # Static assets
│   └── utils/               # API calls, helpers
│
├── backend/
│   ├── src/
│   │   ├── routes/          # Upload, papers, authentication
│   │   ├── main.py          # FastAPI entry point
│   │   └── models/          # Pydantic schemas and database models
│   └── requirements.txt
│
└── README.md
```

## Future Improvements

* Fine-tuned document summarization and section retrieval
* Support for highlighting answers directly in PDFs
* S3 integration for persistent file storage
* User collaboration and shared workspaces

---

## License

This project is licensed under the MIT License.

---
