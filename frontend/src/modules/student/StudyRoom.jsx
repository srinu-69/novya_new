
 

import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';

import { FaSearch, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

 

const StudyRoom = () => {

  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');

  const [sentRequests, setSentRequests] = useState(new Set());

  const [selectedFriend, setSelectedFriend] = useState(null);

  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState('');

 

  const sampleFriends = [

    { username: 'john_doe', email: 'john@example.com' },

    { username: 'jane_smith', email: 'jane@example.com' },

    { username: 'mike_wilson', email: 'mike@example.com' },

    { username: 'sarah_connor', email: 'sarah@example.com' },

  ];

 

  const filteredFriends = sampleFriends.filter(

    (friend) =>

      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||

      friend.email.toLowerCase().includes(searchQuery.toLowerCase())

  );

 

  const handleSearch = (e) => {

    e.preventDefault();

    // Handle search logic here, e.g., search friends

    console.log('Searching for:', searchQuery);

  };

 

  const handleFriendRequest = (friend) => {

    if (!sentRequests.has(friend.username)) {

      setSentRequests(prev => new Set([...prev, friend.username]));

      console.log('Sending friend request to:', friend.username);

    }

  };

 

  const handleSelectFriend = (friend) => {

    setSelectedFriend(friend);

    // Initialize chat if new friend

    if (messages.length === 0 || messages[0].friend !== friend.username) {

      setMessages([{ type: 'bot', text: `Hello! I'm ${friend.username}. Let's study together!` }]);

    }

  };

 

  const handleSendMessage = (e) => {

    e.preventDefault();

    if (inputMessage.trim()) {

      const userMsg = { type: 'user', text: inputMessage, friend: selectedFriend?.username || 'General' };

      setMessages(prev => [...prev, userMsg]);

      setInputMessage('');

 

      // Simulate bot reply after a short delay

      setTimeout(() => {

        const replies = [

          `Thanks for your message: "${inputMessage}". What would you like to study?`,

          `Interesting point! Let's discuss "${inputMessage}" more.`,

          `I agree with "${inputMessage}". Any questions on this topic?`,

          `Great question: "${inputMessage}". The answer is... (study notes here).`

        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const botReply = { type: 'bot', text: randomReply };

        setMessages(prev => [...prev, botReply]);

      }, 1000);

    }

  };

 

  return (

    <div className="study-room-container">

      {/* Main Study Room Content - Chat Area */}

      <div className="study-room-main">

        <header className="study-room-header"><br></br><br></br>

          <h1>{t('studyRoomTitle', 'Study Room')}</h1>

          <p>{t('studyRoomSubtitle', 'Connect with friends and study together.')}</p>

        </header>

 

        <main className="study-room-content">

          <div className={`chat-area ${selectedFriend ? '' : 'empty'}`}>

            {selectedFriend && (

              <div className="chat-header">

                <button onClick={() => setSelectedFriend(null)} className="back-btn">

                  <FaArrowLeft />

                </button>

                <h3>Chatting with @{selectedFriend.username}</h3>

                <div></div> {/* Spacer for alignment */}

              </div>

            )}

            <div className="messages-container">

              {messages.length === 0 && !selectedFriend && (

                <div className="welcome-message">

                  <p>Type your question below to start chatting.</p>

                </div>

              )}

              {messages.map((msg, index) => (

                <div key={index} className={`message ${msg.type}`}>

                  <span>{msg.text}</span>

                </div>

              ))}

            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">

              <input

                type="text"

                value={inputMessage}

                onChange={(e) => setInputMessage(e.target.value)}

                placeholder="Type your question..."

                className="chat-input"

              />

              <button type="submit" className="send-btn">

                <FaPaperPlane />

              </button>

            </form>

          </div>

        </main>

      </div>

 

      {/* Right Sidebar with Search Bar for Friends */}

      <aside className="study-room-sidebar">

        <div className="search-section">

          <h3>{t('searchFriends', 'Search Friends')}</h3>

          <form onSubmit={handleSearch} className="search-form">

            <div className="search-input-wrapper">

              <FaSearch className="search-icon" />

              <input

                type="text"

                value={searchQuery}

                onChange={(e) => setSearchQuery(e.target.value)}

                placeholder={t('searchFriendsPlaceholder', 'Search by username or email...')}

                className="search-input"

              />

            </div>

            <button type="submit" className="search-btn">

              {t('search', 'Search')}

            </button>

          </form>

 

          {/* Display Filtered Friends Below Search Bar */}

          <div className="friends-list">

            <h4>Suggested Friends</h4>

            {filteredFriends.length > 0 ? (

              filteredFriends.map((friend, index) => (

                <div key={index} className="friend-item" onClick={() => handleSelectFriend(friend)}>

                  <div className="friend-info">

                    <span className="username">@{friend.username}</span>

                    <span className="email">{friend.email}</span>

                  </div>

                  <button

                    className={`friend-request-btn ${sentRequests.has(friend.username) ? 'sent' : ''}`}

                    onClick={(e) => {

                      e.stopPropagation();

                      handleFriendRequest(friend);

                    }}

                    disabled={sentRequests.has(friend.username)}

                  >

                    {sentRequests.has(friend.username) ? 'Sent' : 'Friend Request'}

                  </button>

                </div>

              ))

            ) : (

              <p>No friends found.</p>

            )}

          </div>

        </div>

      </aside>

 

      <style jsx>{`

        .study-room-container {

          display: flex;

          min-height: 100vh;

          background: #f8fafc;

        }

 

        .study-room-main {

          flex: 1;

          padding: 0;

        }

 

        .study-room-header {

          text-align: center;

          padding: 2rem;

          background: white;

          box-shadow: 0 2px 4px rgba(0,0,0,0.05);

        }

 

        .study-room-header h1 {

          font-size: 2.5rem;

          color: #2D5D7B;

          margin-bottom: 0.5rem;

        }

 

        .study-room-header p {

          font-size: 1.1rem;

          color: #64748b;

          margin: 0;

        }

 

        .study-room-content {

          height: calc(100vh - 120px);

          display: flex;

          justify-content: center;

          align-items: center;

        }

 

        .chat-area {

          background: white;

          border-radius: 12px;

          box-shadow: 0 4px 12px rgba(0,0,0,0.08);

          height: 80%;

          width: 80%;

          max-width: 800px;

          display: flex;

          flex-direction: column;

        }

 

        .chat-area.empty {

          justify-content: center;

          align-items: center;

        }

 

        .chat-header {

          display: flex;

          justify-content: space-between;

          align-items: center;

          padding: 1rem;

          border-bottom: 1px solid #eee;

          background: #f8f9fa;

          border-radius: 12px 12px 0 0;

        }

 

        .chat-header h3 {

          margin: 0;

          color: #2D5D7B;

          display: flex;

          align-items: center;

          gap: 0.5rem;

        }

 

        .back-btn {

          background: none;

          border: none;

          color: #6c757d;

          cursor: pointer;

          font-size: 1.2rem;

        }

 

        .welcome-message {

          text-align: center;

          color: #64748b;

          font-size: 1.2rem;

          padding: 2rem;

        }

 

        .messages-container {

          flex: 1;

          padding: 1rem;

          overflow-y: auto;

          display: flex;

          flex-direction: column;

          gap: 1rem;

        }

 

        .message {

          max-width: 70%;

          padding: 0.75rem 1rem;

          border-radius: 18px;

          word-wrap: break-word;

        }

 

        .message.user {

          align-self: flex-end;

          background: #2D5D7B;

          color: white;

        }

 

        .message.bot {

          align-self: flex-start;

          background: #e9ecef;

          color: #333;

        }

 

        .chat-input-form {

          display: flex;

          padding: 1rem;

          border-top: 1px solid #eee;

          gap: 0.5rem;

        }

 

        .chat-input {

          flex: 1;

          padding: 0.75rem 1rem;

          border: 1px solid #ddd;

          border-radius: 20px;

          outline: none;

        }

 

        .send-btn {

          background: #2D5D7B;

          color: white;

          border: none;

          padding: 0.75rem;

          border-radius: 50%;

          cursor: pointer;

          display: flex;

          align-items: center;

          justify-content: center;

          width: 40px;

          height: 40px;

        }

 

        .study-room-sidebar {

          width: 300px;

          background: white;

          padding: 2rem;

          box-shadow: -2px 0 10px rgba(0,0,0,0.05);

          position: fixed;

          right: 0;

          top: 0;

          height: 100vh;

          overflow-y: auto;

          z-index: 10;

        }

 

        .search-section {

          margin-bottom: 2rem;

        }

 

        .search-section h3 {

          color: #2D5D7B;

          margin-bottom: 1rem;

        }

 

        .search-form {

          display: flex;

          flex-direction: column;

          gap: 0.5rem;

          margin-bottom: 1rem;

        }

 

        .search-input-wrapper {

          position: relative;

          display: flex;

          align-items: center;

        }

 

        .search-icon {

          position: absolute;

          left: 12px;

          color: #64748b;

        }

 

        .search-input {

          width: 100%;

          padding: 12px 12px 12px 40px;

          border: 1px solid #ddd;

          border-radius: 6px;

          font-size: 14px;

        }

 

        .search-btn {

          background: #2D5D7B;

          color: white;

          border: none;

          padding: 12px;

          border-radius: 6px;

          cursor: pointer;

          font-weight: 500;

        }

 

        .friends-list {

          margin-top: 1rem;

        }

 

        .friends-list h4 {

          color: #2D5D7B;

          margin-bottom: 1rem;

        }

 

        .friend-item {

          display: flex;

          justify-content: space-between;

          align-items: center;

          padding: 0.75rem;

          border: 1px solid #eee;

          border-radius: 6px;

          margin-bottom: 0.5rem;

          cursor: pointer;

          transition: background 0.2s;

        }

 

        .friend-item:hover {

          background: #f8f9fa;

        }

 

        .friend-info {

          flex: 1;

        }

 

        .username {

          display: block;

          font-weight: 500;

          color: #2D5D7B;

        }

 

        .email {

          display: block;

          font-size: 0.9rem;

          color: #64748b;

        }

 

        .friend-request-btn {

          background: #10b981;

          color: white;

          border: none;

          padding: 0.5rem 1rem;

          border-radius: 4px;

          cursor: pointer;

          font-size: 0.85rem;

        }

 

        .friend-request-btn.sent {

          background: #6c757d;

          cursor: not-allowed;

        }

 

        .friend-request-btn:hover:not(.sent) {

          background: #059669;

        }

 

        @media (max-width: 768px) {

          .study-room-container {

            flex-direction: column;

          }

 

          .study-room-sidebar {

            position: relative;

            width: 100%;

            height: auto;

            box-shadow: none;

          }

 

          .study-room-content {

            height: auto;

          }

 

          .chat-area, .empty-chat-area {

            height: 500px;

            width: 100%;

          }

        }

      `}</style>

    </div>

  );

};

 

export default StudyRoom;
