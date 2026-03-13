"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store/useChatStore";
import { X, Send, Bot, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatBot() {
  const { isOpen, messages, toggleOpen, setOpen, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to store
    addMessage({
      role: "user",
      content: userMessage,
    });

    setIsLoading(true);

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chat";
      let response;
      
      try {
        response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: userMessage,
            context: {
              path: window.location.pathname
            }
          }),
        });
      } catch (fetchError) {
        console.warn("Primary API failed, falling back to local API:", fetchError);
        // Fallback to local API if primary fails (e.g., n8n is down)
        if (apiEndpoint !== "/api/chat") {
          response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              message: userMessage,
              context: {
                path: window.location.pathname
              }
            }),
          });
        } else {
          throw fetchError;
        }
      }

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      addMessage({
        role: "assistant",
        content: data.content,
        action: data.action,
      });

      // Handle specific actions returned by the AI
      if (data.action === "NAVIGATE_ORDERS") {
        setTimeout(() => {
          router.push("/user/orders");
          // Keep chat open after navigation
        }, 1500); // Small delay to let user read the message before routing
      }

    } catch (error) {
      console.error("Chat Error:", error);
      addMessage({
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 z-50 flex items-center justify-center gap-2 border-2 border-yellow-400 ${isOpen ? "rotate-90 opacity-0 pointer-events-none scale-50" : "rotate-0 opacity-100 scale-100"}`}
        aria-label="Toggle Chat"
      >
        {/* Custom Bee SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          <path d="M12 21a9 9 0 0 0 9-9c0-5-4-9-9-9s-9 4-9 9a9 9 0 0 0 9 9z" />
          <path d="M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M15.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M12 16v-6" />
          <path d="M8 12h8" />
          <path d="M11.5 3.5 10 2" />
          <path d="M12.5 3.5 14 2" />
        </svg>
        <span className="font-semibold text-sm drop-shadow-sm whitespace-nowrap">Have a chat with Us!</span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 border border-zinc-200 dark:border-zinc-800 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ height: "32rem", maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="bg-yellow-500 text-white p-4 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-amber-500">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Bee</h3>
              <p className="text-xs text-yellow-100">Virtual Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white hover:text-yellow-100 transition-colors p-1 rounded-full hover:bg-yellow-600/50"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-zinc-950/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-2 max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className={`mt-auto flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-yellow-500 text-white"
                }`}>
                  {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div
                  className={`p-3 rounded-2xl text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%] flex-row">
                <div className="mt-auto flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm shadow-sm flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-zinc-900 dark:text-zinc-100"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
