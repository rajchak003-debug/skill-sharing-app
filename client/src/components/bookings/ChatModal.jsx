import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { X, Send } from 'lucide-react';
import { getBookingMessages, sendMessage } from '../../services/MessageService';
import { useAuth } from '../../hooks/useAuth';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const ChatModal = ({ booking, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const otherUser = booking.learner?._id === user?._id ? booking.provider : booking.learner;

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getBookingMessages(booking._id);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join_booking_room', booking._id);

    socketRef.current.on('receive_booking_message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [booking._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const currentText = text;
    setText('');

    try {
      const res = await sendMessage(booking._id, currentText);
      const savedMsg = res.data;
      setMessages((prev) => [...prev, savedMsg]);
      socketRef.current.emit('send_booking_message', {
        bookingId: booking._id,
        message: savedMsg,
      });
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full h-[500px] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white px-5 py-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{otherUser?.name}</h3>
            <p className="text-xs text-indigo-100 truncate">{booking.skill?.title}</p>
          </div>
          <button onClick={onClose} className="text-indigo-100 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-8">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No messages yet. Say hello or share your meeting link!
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user?._id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;