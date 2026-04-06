import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { FiSend, FiCircle, FiMessageSquare, FiSearch, FiMoreVertical, FiPaperclip } from "react-icons/fi";
import Navbar from "../components/Navbar";

const Chat = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchConversations();

    socket.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
    });

    socket.current.on("receive_message", (newMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === newMessage.conversationId
            ? { ...c, lastMessage: newMessage.content, lastMessageTime: newMessage.createdAt }
            : c
        )
      );
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [user, token]);

  useEffect(() => {
    const targetUserId = searchParams.get("userId");
    const listingId = searchParams.get("listingId");
    
    if (targetUserId && conversations.length > 0) {
      const existing = conversations.find(
        (c) => c.otherUser?._id === targetUserId
      );
      if (existing) {
        handleSelectConversation(existing);
      } else if (listingId) {
        fetchHeroInfo(targetUserId, listingId);
      }
    }
  }, [conversations, searchParams]);

  const fetchHeroInfo = async (otherUserId, listingId) => {
    try {
      setLoading(true);
      const [userRes, listingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${otherUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/listings/${listingId}`)
      ]);

      const otherUser = userRes.data.user;
      const sortedIds = [user._id, otherUserId].sort();
      const conversationId = `conv_${sortedIds[0]}_${sortedIds[1]}_${listingId}`;

      const mockConv = {
        conversationId,
        otherUser,
        listingId,
        isNew: true,
        lastMessage: "Start a new conversation",
        messages: []
      };

      setActiveConversation(mockConv);
      setMessages([]);
      if (socket.current) socket.current.emit("join_room", conversationId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/conversations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/conversation/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;
    setSending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/send`,
        {
          conversationId: activeConversation.conversationId,
          receiverId: activeConversation.otherUser._id,
          listingId: activeConversation.listingId || searchParams.get("listingId"),
          content: messageText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessageText("");
      fetchMessages(activeConversation.conversationId);

      if (activeConversation.isNew) {
        fetchConversations();
        setActiveConversation(prev => ({ ...prev, isNew: false }));
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === activeConversation.conversationId
              ? { ...c, lastMessage: messageText }
              : c
          )
        );
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    fetchMessages(conversation.conversationId);
    if (socket.current) socket.current.emit("join_room", conversation.conversationId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 pt-32 pb-10 flex gap-6 overflow-hidden">
        
        {/* Conversations Sidebar */}
        <div className="w-full md:w-96 flex flex-col glass rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-purple-500/5">
          <div className="p-8 border-b border-gray-100/50">
            <h2 className="text-2xl font-black mb-6">Messages</h2>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest">Loading Chats</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-30">
                <FiMessageSquare size={48} className="mb-4" />
                <p className="font-black">No chats yet</p>
                <p className="text-xs font-bold uppercase mt-2 leading-relaxed">Browse listings to start a conversation</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 rounded-3xl transition-all flex items-center gap-4 group ${
                    activeConversation?.conversationId === conv.conversationId
                      ? "bg-primary text-white shadow-xl shadow-purple-500/20"
                      : "hover:bg-white"
                  }`}
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <div className="w-full h-full rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg overflow-hidden border-2 border-white/10">
                      {conv.otherUser?.avatar ? (
                        <img src={conv.otherUser.avatar} className="w-full h-full object-cover" />
                      ) : (
                        conv.otherUser?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={`font-black truncate ${activeConversation?.conversationId === conv.conversationId ? "text-white" : "text-gray-900"}`}>
                        {conv.otherUser?.name}
                      </p>
                      <span className={`text-[10px] font-bold uppercase opacity-60 ${activeConversation?.conversationId === conv.conversationId ? "text-white" : "text-gray-400"}`}>
                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className={`text-xs font-medium truncate ${activeConversation?.conversationId === conv.conversationId ? "text-white/80" : "text-gray-500"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="flex-1 hidden md:flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                    {activeConversation.otherUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 leading-none mb-1">{activeConversation.otherUser?.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Now</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400"><FiMoreVertical /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-10 space-y-6">
                {messages.map((msg, i) => {
                  const isOwn = (msg.sender?._id || msg.sender) === user._id;
                  return (
                    <div key={msg._id || i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] group`}>
                        <div className={`px-6 py-4 rounded-[2rem] font-medium text-sm leading-relaxed ${
                          isOwn 
                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-purple-500/10" 
                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`mt-2 flex items-center gap-2 px-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                          <span className="text-[10px] font-bold text-gray-300 uppercase italic">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-8 pt-0">
                <div className="glass p-3 rounded-[2rem] flex items-center gap-2 border border-gray-100 shadow-xl shadow-purple-500/5">
                  <button className="p-3 text-gray-400 hover:text-primary transition-colors"><FiPaperclip size={20} /></button>
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message here..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-gray-700 placeholder:text-gray-300"
                    disabled={sending}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!messageText.trim() || sending}
                    className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
              <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center mb-10 text-primary animate-float">
                <FiMessageSquare size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Inbox</h2>
              <p className="text-gray-400 font-bold max-w-sm leading-relaxed uppercase text-xs tracking-widest">
                Select a conversation from the sidebar to view messages or negotiate a rental.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;