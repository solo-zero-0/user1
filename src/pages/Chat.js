import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserEmail(user.email);

        // Fetch admin email
        const adminCol = collection(db, 'admin');
        const adminSnapshot = await getDocs(adminCol);
        let adminEmailFetched = null;
        adminSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.email) {
            adminEmailFetched = data.email;
          }
        });
        if (adminEmailFetched) {
          setAdminEmail(adminEmailFetched);
        } else {
          console.error('No admin email found');
          alert('Admin user not found. Cannot use chat.');
        }
      } else {
        setCurrentUserEmail(null);
        setMessages([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUserEmail || !adminEmail) return;

    const q = query(
      collection(db, 'chatMessages'),
      where('participants', 'array-contains', currentUserEmail),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      console.error('Error listening to chat messages:', error.message, error.stack);
    });

    return () => unsubscribe();
  }, [currentUserEmail, adminEmail]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !adminEmail) return;

    try {
      await addDoc(collection(db, 'chatMessages'), {
        text: newMessage.trim(),
        sender: currentUserEmail,
        receiver: adminEmail,
        participants: [currentUserEmail, adminEmail],
        timestamp: serverTimestamp(),
        read: false,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.message, error.stack);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat with Admin</h1>
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${msg.sender === currentUserEmail ? 'user-message' : 'admin-message'}`}
          >
            <div className="message-sender">{msg.sender === currentUserEmail ? 'You' : 'Admin'}</div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;
