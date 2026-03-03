import { useEffect, useState, useRef } from "react";

const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000/api";

const SUGGESTIONS = [
  "How long does shipping take?",
  "How do I request a refund?",
  "How can I cancel my subscription?",
  "Is my data secure?",
  "How do I get API access?",
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const bottomRef = useRef(null);

  const getSessionId = () => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("sessionId", id);
    }
    return id;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (customInput) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim()) return;

    const userMessage = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          message: messageToSend,
          debug,
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      setMetadata({
        tokensUsed: data.tokensUsed,
        retrievedChunks: data.retrievedChunks,
        similarityScores: data.sources?.map((s) => s.score) || [],
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const newChat = () => {
    localStorage.removeItem("sessionId");
    setMessages([]);
    setMetadata(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">GenAI RAG Assistant</h1>
        <div className="flex gap-3">
          <button
            onClick={newChat}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-700 transition"
          >
            New Chat
          </button>
          <button
            onClick={() => setDebug((prev) => !prev)}
            className="text-sm bg-gray-700 text-white px-3 py-1 rounded cursor-pointer hover:bg-gray-900 transition"
          >
            {debug ? "Disable Debug" : "Enable Debug"}
          </button>
        </div>
      </div>

      {/* Onboarding Section */}
      {messages.length === 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-4 text-sm">
          <div className="mb-2 font-medium text-blue-800">
            You can ask about:
          </div>
          <ul className="list-disc ml-6 text-blue-700">
            <li>Billing & refunds</li>
            <li>Shipping & delivery times</li>
            <li>Account security</li>
            <li>Subscriptions</li>
            <li>API & developer access</li>
          </ul>

          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => sendMessage(suggestion)}
                className="bg-white border text-xs px-3 py-1 rounded-full hover:bg-blue-100 transition cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index}>
            <div
              className={`max-w-xl px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white shadow"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="bg-white shadow px-4 py-2 rounded-lg w-fit">
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Debug Panel */}
      {debug && metadata && (
        <div className="bg-gray-200 p-3 text-sm border-t">
          <div>
            <strong>Tokens Used:</strong> {metadata.tokensUsed}
          </div>
          <div>
            <strong>Retrieved Chunks:</strong> {metadata.retrievedChunks}
          </div>
          <div>
            <strong>Top Similarity Scores:</strong>
            <ul className="list-disc ml-6">
              {metadata.similarityScores.map((score, i) => (
                <li key={i}>{(score * 100).toFixed(2)}%</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about refunds, shipping, subscriptions, security..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
