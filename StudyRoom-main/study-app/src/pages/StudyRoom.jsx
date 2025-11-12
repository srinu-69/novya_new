import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudyRoom.css";

const StudyRoom = ({ setIsLoggedIn }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [groupUnreadCounts, setGroupUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showExitGroup, setShowExitGroup] = useState(false);
  const [availableFriends, setAvailableFriends] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // State variables for advanced features
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showReactions, setShowReactions] = useState(null);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const searchContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = parseInt(localStorage.getItem("user_id"));

  // Common emojis for reactions and picker
  const commonEmojis = ['😂', '😍', '😮', '😢', '😡', '👍', '❤️', '🔥', '🎉', '👏', '🙏', '🤔'];

  // --- Show notification ---
  const showNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // --- Scroll chat to bottom ---
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [messages]);

  // --- Filter friends based on search query ---
  useEffect(() => {
    if (friendSearchQuery.trim()) {
      const filtered = friends.filter(friend =>
        friend.friend_username.toLowerCase().includes(friendSearchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [friendSearchQuery, friends]);

  // --- Fetch unread counts ---
  const fetchUnreadCounts = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/unread_counts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCounts(res.data);
    } catch (err) {
      console.log("Error fetching unread counts:", err);
    }
  };

  // --- Fetch group unread counts ---
  const fetchGroupUnreadCounts = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/group_unread_counts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupUnreadCounts(res.data);
    } catch (err) {
      console.log("Error fetching group unread counts:", err);
    }
  };

  // --- Update unread count for a specific friend ---
  const updateUnreadCount = (friendId, count) => {
    setUnreadCounts(prev => ({
      ...prev,
      [friendId]: count
    }));
  };

  // --- Update group unread count for a specific group ---
  const updateGroupUnreadCount = (groupId, count) => {
    setGroupUnreadCounts(prev => ({
      ...prev,
      [groupId]: count
    }));
  };

  // --- Fetch friends & requests ---
  const fetchFriends = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data);
      setFilteredFriends(res.data);

      // Create unread counts mapping from friends data
      const counts = {};
      res.data.forEach(friend => {
        counts[friend.friend_id] = friend.unread_count || 0;
        fetchLastMessage(friend.friend_id);
      });
      setUnreadCounts(counts);
    } catch (err) {
      console.log("Error fetching friends:", err);
    }
  };

  // --- Search friends by name ---
  const searchFriends = async (searchQuery) => {
    if (!searchQuery.trim()) {
      fetchFriends();
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8000/friends/${userId}/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredFriends(res.data);
    } catch (err) {
      console.log("Error searching friends:", err);
    }
  };

  // --- Fetch groups ---
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/groups/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.log("Error fetching groups:", err);
    }
  };

  // --- Fetch last message for a friend ---
  const fetchLastMessage = async (friendId) => {
    try {
      const res = await axios.get(`http://localhost:8000/last_message/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.content) {
        setLastMessages(prev => ({
          ...prev,
          [friendId]: {
            content: res.data.content,
            timestamp: res.data.timestamp, // Use timestamp as received from backend
            sender_id: res.data.sender_id,
            read: res.data.read,
            delivered: res.data.delivered,
            has_attachment: res.data.has_attachment,
            attachment_type: res.data.attachment_type
          }
        }));
      } else {
        setLastMessages(prev => ({
          ...prev,
          [friendId]: {
            content: "",
            timestamp: null,
            sender_id: null,
            read: true,
            delivered: true,
            has_attachment: false
          }
        }));
      }
    } catch (err) {
      console.log(`Error fetching last message for friend ${friendId}:`, err);
      setLastMessages(prev => ({
        ...prev,
        [friendId]: {
          content: "",
          timestamp: null,
          sender_id: null,
          read: true,
          delivered: true,
          has_attachment: false
        }
      }));
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/friend_requests/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.log("Error fetching requests:", err);
    }
  };

  // --- Fetch group info ---
  const fetchGroupInfo = async (group_id) => {
    try {
      const res = await axios.get(`http://localhost:8000/group_info/${group_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupInfo(res.data);

      // Get available friends to add (friends not already in group)
      const groupMemberIds = new Set(res.data.members.map(m => m.user_id));
      const available = friends.filter(f => !groupMemberIds.has(f.friend_id));
      setAvailableFriends(available);
    } catch (err) {
      console.log("Error fetching group info:", err);
      showNotification("Failed to load group info");
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchFriends();
    fetchRequests();
    fetchGroups();
    fetchUnreadCounts();
    fetchGroupUnreadCounts();

    const interval = setInterval(() => {
      fetchFriends();
      fetchRequests();
      fetchGroups();
      fetchUnreadCounts();
      fetchGroupUnreadCounts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Search users ---
  const searchUsers = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await axios.get(`http://localhost:8000/users?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length === 0) {
        showNotification("Invalid username");
        setUsers([]);
      } else {
        // Filter out users who are already friends
        const filtered = res.data.filter(u =>
          u.id !== userId && !friends.some(f => f.friend_id === u.id)
        );

        if (filtered.length === 0) {
          showNotification("No users found or already friends");
        }

        setUsers(filtered);
      }
    } catch (err) {
      console.log("Error searching users:", err);
      if (err.response && err.response.status === 400) {
        showNotification(err.response.data.detail);
      } else {
        showNotification("Error searching users");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // --- Send friend request ---
  const sendRequest = async (receiver_id, username) => {
    if (receiver_id === userId) {
      showNotification("Cannot send friend request to yourself!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/friend_request",
        { receiver_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
      showNotification(`Friend request sent to ${username}!`);
    } catch (err) {
      console.log("Error sending friend request:", err);
      if (err.response && err.response.status === 400) {
        showNotification(err.response.data.detail);
      } else {
        showNotification("Failed to send friend request");
      }
    }
  };

  // --- Accept request ---
  const acceptRequest = async (request_id, username) => {
    try {
      await axios.post(
        `http://localhost:8000/accept_request/${request_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
      fetchFriends();
      showNotification(`You are now friends with ${username}!`);
    } catch (err) {
      console.log("Error accepting request:", err);
      showNotification("Failed to accept friend request");
    }
  };

  // --- Create group ---
  const createGroup = async () => {
    if (!newGroupName.trim()) {
      showNotification("Group name is required");
      return;
    }

    if (selectedFriends.length === 0) {
      showNotification("Select at least one friend");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/groups",
        {
          name: newGroupName,
          description: newGroupDescription,
          member_ids: selectedFriends
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Group created successfully!");
      setShowCreateGroup(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedFriends([]);
      fetchGroups();
    } catch (err) {
      console.log("Error creating group:", err);
      showNotification("Failed to create group");
    }
  };

  // --- Toggle friend selection for group ---
  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  // --- Add member to group ---
  const addMemberToGroup = async (friendId, username) => {
    try {
      await axios.post(
        `http://localhost:8000/groups/${activeGroup.id}/add_member`,
        { user_id: friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification(`Added ${username} to the group`);
      setShowAddMember(false);
      fetchGroupInfo(activeGroup.id);
      fetchGroups(); // Refresh groups list
    } catch (err) {
      console.log("Error adding member:", err);
      showNotification("Failed to add member to group");
    }
  };

  // --- Remove member from group ---
  const removeMemberFromGroup = async (memberId, username) => {
    try {
      await axios.post(
        `http://localhost:8000/groups/${activeGroup.id}/remove_member`,
        { user_id: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification(`Removed ${username} from the group`);
      fetchGroupInfo(activeGroup.id);
      fetchGroups(); // Refresh groups list
    } catch (err) {
      console.log("Error removing member:", err);
      showNotification("Failed to remove member from group");
    }
  };

  // --- Make member admin ---
  const makeMemberAdmin = async (memberId, username) => {
    try {
      await axios.post(
        `http://localhost:8000/groups/${activeGroup.id}/make_admin`,
        { user_id: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification(`Made ${username} a group admin`);
      fetchGroupInfo(activeGroup.id);
    } catch (err) {
      console.log("Error making admin:", err);
      showNotification("Failed to make member admin");
    }
  };

  // --- Remove admin role ---
  const removeMemberAdmin = async (memberId, username) => {
    try {
      await axios.post(
        `http://localhost:8000/groups/${activeGroup.id}/remove_admin`,
        { user_id: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification(`Removed admin role from ${username}`);
      fetchGroupInfo(activeGroup.id);
    } catch (err) {
      console.log("Error removing admin:", err);
      showNotification("Failed to remove admin role");
    }
  };

  // --- Exit group ---
  const exitGroup = async () => {
    if (!activeGroup) return;

    try {
      await axios.post(
        `http://localhost:8000/groups/${activeGroup.id}/exit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification(`You have exited the group '${activeGroup.name}'`);
      setShowExitGroup(false);
      setShowGroupInfo(false);
      setActiveGroup(null);
      setMessages([]);
      fetchGroups(); // Refresh groups list
    } catch (err) {
      console.log("Error exiting group:", err);
      if (err.response && err.response.status === 400) {
        showNotification(err.response.data.detail);
      } else {
        showNotification("Failed to exit group");
      }
    }
  };

  // --- Emoji Reactions ---
  const handleReaction = async (messageId, emoji, isGroup = false) => {
    try {
      const endpoint = isGroup
        ? `/group_messages/${messageId}/react`
        : `/messages/${messageId}/react`;

      await axios.post(
        `http://localhost:8000${endpoint}`,
        { message_id: messageId, emoji, action: 'add' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || {};
          const userReactions = currentReactions[emoji] || [];
          if (!userReactions.includes(userId)) {
            return {
              ...msg,
              reactions: {
                ...currentReactions,
                [emoji]: [...userReactions, userId]
              }
            };
          }
        }
        return msg;
      }));

      setShowReactions(null);
    } catch (err) {
      console.log("Error adding reaction:", err);
      showNotification("Failed to add reaction");
    }
  };

  const removeReaction = async (messageId, emoji, isGroup = false) => {
    try {
      const endpoint = isGroup
        ? `/group_messages/${messageId}/react`
        : `/messages/${messageId}/react`;

      await axios.post(
        `http://localhost:8000${endpoint}`,
        { message_id: messageId, emoji, action: 'remove' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId && msg.reactions && msg.reactions[emoji]) {
          const updatedReactions = { ...msg.reactions };
          updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== userId);
          if (updatedReactions[emoji].length === 0) {
            delete updatedReactions[emoji];
          }
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      }));
    } catch (err) {
      console.log("Error removing reaction:", err);
      showNotification("Failed to remove reaction");
    }
  };

  // --- Message Deletion ---
  const handleDeleteMessage = async (messageId, isGroup = false) => {
    try {
      const endpoint = isGroup
        ? `/group_messages/${messageId}`
        : `/messages/${messageId}`;

      await axios.delete(
        `http://localhost:8000${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, is_deleted: true, content: "This message was deleted" } : msg
      ));

      showNotification("Message deleted successfully");
    } catch (err) {
      console.log("Error deleting message:", err);
      showNotification("Failed to delete message");
    }
  };

  // --- Message Replying ---
  const handleReply = (message) => {
    setReplyToMessage(message);
    // Focus on message input
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  const cancelReply = () => {
    setReplyToMessage(null);
  };

  const sendReply = () => {
    if (!message.trim() || !replyToMessage) return;

    if (activeFriend && ws.current) {
      ws.current.send(`REPLY:${replyToMessage.id}:${message}`);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: message,
        read: false,
        delivered: false,
        timestamp: new Date().toISOString(),
        sender_id: userId,
        type: 'individual',
        reply_to_message: {
          id: replyToMessage.id,
          sender_username: activeFriend.friend_username,
          content: replyToMessage.content
        }
      }]);
      setReplyToMessage(null);
      setMessage("");
    } else if (activeGroup && ws.current) {
      ws.current.send(`REPLY:${replyToMessage.id}:${message}`);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: message,
        timestamp: new Date().toISOString(),
        sender_id: userId,
        type: 'group',
        reply_to_message: {
          id: replyToMessage.id,
          sender_username: replyToMessage.sender_username,
          content: replyToMessage.content
        }
      }]);
      setReplyToMessage(null);
      setMessage("");
    }
  };

  // --- Message Selection ---
  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const clearSelection = () => {
    setSelectedMessages([]);
  };

  // --- Emoji Picker ---
  const addEmojiToMessage = (emoji) => {
    setMessage(prev => prev + emoji);
    setEmojiPickerVisible(false);
  };

  // --- File Upload Functions ---
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      showNotification("File size too large (max 50MB)");
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);
    if (replyToMessage) {
      formData.append("reply_to_message_id", replyToMessage.id);
    }

    try {
      let response;
      if (activeFriend) {
        // Individual chat file upload
        response = await axios.post(
          `http://localhost:8000/upload/individual/${activeFriend.friend_id}`,
          formData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (activeGroup) {
        // Group chat file upload
        response = await axios.post(
          `http://localhost:8000/upload/group/${activeGroup.id}`,
          formData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      showNotification("File uploaded successfully!");
      setMessage("");
      setReplyToMessage(null);

      // Refresh messages to show the uploaded file
      if (activeFriend) {
        startChat(activeFriend);
      } else if (activeGroup) {
        startGroupChat(activeGroup);
      }
    } catch (err) {
      console.log("Error uploading file:", err);
      showNotification("Failed to upload file");
    } finally {
      setUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- UPDATED: WhatsApp-style Time Formatting ---

  // Format timestamp for display - WhatsApp style
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      
      if (isNaN(date.getTime())) {
        return "";
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Format time part (3:45 PM)
      const timeString = date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toLowerCase();

      if (messageDate.getTime() === today.getTime()) {
        // Today - show only time
        return timeString;
      } else if (messageDate.getTime() === yesterday.getTime()) {
        // Yesterday - show "Yesterday" + time
        return `Yesterday, ${timeString}`;
      } else {
        // Earlier than yesterday - show full date + time
        const dateString = date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        return `${dateString}, ${timeString}`;
      }
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  // Get exact time for tooltips
  const getExactTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      
      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting exact time:", error);
      return "";
    }
  };

  // Format time for sidebar (shorter version)
  const formatSidebarTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      
      if (isNaN(date.getTime())) {
        return "";
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      if (messageDate.getTime() === today.getTime()) {
        // Today - show only time
        return date.toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).toLowerCase();
      } else if (messageDate.getTime() === yesterday.getTime()) {
        // Yesterday - show "Yesterday"
        return 'Yesterday';
      } else {
        // Earlier than yesterday - show date only
        return date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        });
      }
    } catch (error) {
      console.error("Error formatting sidebar time:", error);
      return "";
    }
  };

  // --- File type icons ---
  const getFileIcon = (fileType, filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();

    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'document':
        if (['pdf'].includes(ext)) return '📕';
        if (['doc', 'docx'].includes(ext)) return '📄';
        if (['xls', 'xlsx'].includes(ext)) return '📊';
        if (['ppt', 'pptx'].includes(ext)) return '📑';
        return '📄';
      default:
        return '📎';
    }
  };

  // --- Render file message ---
  const renderFileMessage = (msg) => {
    if (!msg.has_attachment) return msg.content || msg.text;

    const isOwnMessage = msg.sender_id === userId;
    const baseUrl = 'http://localhost:8000';

    return (
      <div className="file-message">
        <div className="file-info">
          <span className="file-icon">
            {getFileIcon(msg.attachment_type, msg.attachment_filename)}
          </span>
          <div className="file-details">
            <div className="file-name">{msg.attachment_filename}</div>
            <div className="file-type">{msg.attachment_type}</div>
          </div>
        </div>
        <div className="file-actions">
          <a
            href={baseUrl + msg.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
          >
            Download
          </a>
          {msg.attachment_type === 'image' && (
            <a
              href={baseUrl + msg.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-btn"
            >
              View
            </a>
          )}
        </div>
        {msg.content && !msg.content.includes('Sent a') && (
          <div className="file-caption">{msg.content}</div>
        )}
      </div>
    );
  };

  // --- Enhanced message renderer with WhatsApp-style time display ---
  const renderMessage = (msg, idx) => {
    if (msg.is_deleted) {
      return (
        <div key={idx} className={`message ${msg.sender_id === userId ? 'own-message' : 'friend-message'} deleted`}>
          <div className="message-bubble">
            <em>This message was deleted</em>
            <div className="message-time-small" title={getExactTime(msg.timestamp)}>
              {formatTime(msg.timestamp)}
            </div>
          </div>
        </div>
      );
    }

    const isOwnMessage = msg.sender_id === userId;
    const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;
    const displayName = isOwnMessage ? 'You' : (msg.sender_username || activeFriend?.friend_username || 'Unknown');

    return (
      <div
        key={idx}
        className={`message ${isOwnMessage ? 'own-message' : 'friend-message'} ${selectedMessages.includes(msg.id) ? 'selected' : ''}`}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleMessageSelection(msg.id);
        }}
        onClick={() => {
          if (selectedMessages.length > 0) {
            toggleMessageSelection(msg.id);
          }
        }}
      >
        {/* Reply indicator */}
        {msg.reply_to_message && (
          <div className="reply-indicator">
            <div className="reply-line"></div>
            <div className="reply-content">
              <span className="reply-sender">{msg.reply_to_message.sender_username}</span>
              <span className="reply-text">
                {msg.reply_to_message.has_attachment
                  ? `Sent a ${msg.reply_to_message.attachment_type}`
                  : msg.reply_to_message.content
                }
              </span>
            </div>
          </div>
        )}

        <div className="message-bubble">
          {/* Message header with sender name for group chats */}
          {activeGroup && !isOwnMessage && (
            <div className="message-sender">{displayName}</div>
          )}

          {/* Message content */}
          {msg.has_attachment ? renderFileMessage(msg) : (msg.content || msg.text)}

          {/* Message actions - shown on hover */}
          <div className="message-actions">
            <button
              onClick={() => handleReply(msg)}
              className="message-action-btn"
              title="Reply"
            >
              ↩️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(showReactions === msg.id ? null : msg.id);
              }}
              className="message-action-btn"
              title="React"
            >
              😊
            </button>
            {(msg.sender_id === userId || (activeGroup && groupInfo?.current_user_is_admin)) && (
              <button
                onClick={() => handleDeleteMessage(msg.id, activeGroup !== null)}
                className="message-action-btn"
                title="Delete"
              >
                🗑️
              </button>
            )}
          </div>

          {/* Reactions */}
          {hasReactions && (
            <div className="message-reactions">
              {Object.entries(msg.reactions).map(([emoji, users]) => {
                const hasReacted = users.includes(userId);
                return (
                  <span
                    key={emoji}
                    className={`reaction-bubble ${hasReacted ? 'reacted' : ''}`}
                    onClick={() => hasReacted ? removeReaction(msg.id, emoji, activeGroup !== null) : handleReaction(msg.id, emoji, activeGroup !== null)}
                  >
                    {emoji} {users.length}
                  </span>
                );
              })}
            </div>
          )}

          {/* Message info with WhatsApp-style time display */}
          <div className="message-time-small" title={getExactTime(msg.timestamp)}>
            {formatTime(msg.timestamp)}
            {isOwnMessage && msg.type === 'individual' && (
              <span className={`message-status ${msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent'}`}>
                {msg.read ? '✓✓' : msg.delivered ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>

        {/* Reactions picker */}
        {showReactions === msg.id && (
          <div className="reactions-picker">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(msg.id, emoji, activeGroup !== null);
                }}
                className="reaction-option"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- FIXED: Start individual chat with improved WebSocket handling ---
  const startChat = async (friend) => {
    setActiveFriend(friend);
    setActiveGroup(null);
    setShowGroupInfo(false);
    setMessages([]);
    setSelectedMessages([]);
    setReplyToMessage(null);

    try {
      const res = await axios.get(`http://localhost:8000/messages/${friend.friend_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Use timestamps exactly as received from the database
      const formatted = res.data.map(m => ({
        id: m.id,
        content: m.content,
        read: m.read,
        delivered: m.delivered,
        timestamp: m.timestamp, // Use timestamp as received from database
        sender_id: m.sender_id,
        sender_username: m.sender_username,
        type: 'individual',
        has_attachment: m.has_attachment,
        attachment_url: m.attachment_url,
        attachment_type: m.attachment_type,
        attachment_filename: m.attachment_filename,
        reply_to_message: m.reply_to_message,
        reactions: m.reactions,
        is_deleted: m.is_deleted
      }));

      setMessages(formatted);

      if (res.data.length > 0) {
        const lastMsg = res.data[res.data.length - 1];
        setLastMessages(prev => ({
          ...prev,
          [friend.friend_id]: {
            content: lastMsg.content,
            timestamp: lastMsg.timestamp, // Use timestamp as received from database
            sender_id: lastMsg.sender_id,
            read: lastMsg.read,
            delivered: lastMsg.delivered,
            has_attachment: lastMsg.has_attachment,
            attachment_type: lastMsg.attachment_type
          }
        }));
      }

      // Reset unread count for this friend
      updateUnreadCount(friend.friend_id, 0);
    } catch (err) {
      console.log("Error fetching messages:", err);
      showNotification("Error loading messages");
    }

    // Close existing WebSocket connection
    if (ws.current) {
      ws.current.close();
    }

    // Create new WebSocket connection with better error handling
    try {
      const wsUrl = `ws://localhost:8000/ws/${friend.friend_id}?token=${token}`;
      console.log("Connecting to WebSocket:", wsUrl);

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connection established for individual chat");
      };

      ws.current.onmessage = (event) => {
        let data = event.data;
        console.log("WebSocket message received:", data);

        // Handle unread count updates from WebSocket
        if (data.includes(':UNREAD:')) {
          const parts = data.split(':UNREAD:');
          const messagePart = parts[0];
          const unreadCount = parseInt(parts[1]);
          
          // Update unread count for this friend
          if (!isNaN(unreadCount)) {
            updateUnreadCount(friend.friend_id, unreadCount);
          }
          
          // Process the message part normally
          data = messagePart;
        }

        // Handle UNREAD_UPDATE messages (for other friends)
        if (data.startsWith("UNREAD_UPDATE:")) {
          const parts = data.split(':');
          const friendId = parseInt(parts[1]);
          const unreadCount = parseInt(parts[2]);
          
          if (!isNaN(friendId) && !isNaN(unreadCount)) {
            updateUnreadCount(friendId, unreadCount);
          }
          return;
        }

        // Handle different message types
        if (data.startsWith("FILE:")) {
          const parts = data.split(':');
          const senderId = parseInt(parts[1]);
          const filename = parts[2];
          const fileType = parts[3];
          const fileUrl = parts[4];
          const fileMessage = parts[5] || '';
          const replyToId = parts[6] || null;
          const messageId = parts[7] || null;
          const timestamp = parts[8] || new Date().toISOString();

          const isOwnMessage = senderId === userId;

          setMessages(prev => [...prev, {
            id: messageId || Date.now(),
            content: fileMessage,
            read: isOwnMessage,
            delivered: isOwnMessage,
            timestamp: timestamp, // Use timestamp from server
            sender_id: senderId,
            sender_username: isOwnMessage ? 'You' : friend.friend_username,
            type: 'individual',
            has_attachment: true,
            attachment_url: fileUrl,
            attachment_type: fileType,
            attachment_filename: filename,
            reply_to_message_id: replyToId
          }]);

        } else if (data.startsWith("REPLY:")) {
          const parts = data.split(':');
          const messageId = parts[1];
          const senderId = parseInt(parts[2]);
          const messageContent = parts[3];
          const replyToId = parts[4] || null;
          const timestamp = parts[5] || new Date().toISOString();

          const isOwnMessage = senderId === userId;

          setMessages(prev => [...prev, {
            id: messageId,
            content: messageContent,
            read: isOwnMessage,
            delivered: isOwnMessage,
            timestamp: timestamp, // Use timestamp from server
            sender_id: senderId,
            sender_username: isOwnMessage ? 'You' : friend.friend_username,
            type: 'individual',
            reply_to_message_id: replyToId
          }]);

        } else if (data.startsWith("REACTION:")) {
          // Handle reaction updates
          const parts = data.split(':');
          const messageId = parseInt(parts[1]);
          const emoji = parts[2];
          const action = parts[3];

          setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
              const currentReactions = msg.reactions || {};
              if (action === 'add') {
                const userReactions = currentReactions[emoji] || [];
                if (!userReactions.includes(userId)) {
                  return {
                    ...msg,
                    reactions: {
                      ...currentReactions,
                      [emoji]: [...userReactions, userId]
                    }
                  };
                }
              } else {
                const updatedReactions = { ...currentReactions };
                if (updatedReactions[emoji]) {
                  updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== userId);
                  if (updatedReactions[emoji].length === 0) {
                    delete updatedReactions[emoji];
                  }
                }
                return { ...msg, reactions: updatedReactions };
              }
            }
            return msg;
          }));

        } else {
          // Regular text message - parse with timestamp
          const parts = data.split(':');
          const senderId = parseInt(parts[0]);
          const messageContent = parts[1];
          const timestamp = parts[2] || new Date().toISOString();

          const isOwnMessage = senderId === userId;

          setMessages(prev => [...prev, {
            id: Date.now(),
            content: messageContent,
            read: isOwnMessage,
            delivered: isOwnMessage,
            timestamp: timestamp, // Use timestamp from server
            sender_id: senderId,
            sender_username: isOwnMessage ? 'You' : friend.friend_username,
            type: 'individual'
          }]);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
      };

      ws.current.onerror = (error) => {
        console.log("WebSocket error:", error);
        showNotification("Connection error");
      };
    } catch (error) {
      console.log("Error creating WebSocket:", error);
      showNotification("Failed to connect");
    }
  };

  // --- Start group chat ---
  const startGroupChat = async (group) => {
    setActiveGroup(group);
    setActiveFriend(null);
    setShowGroupInfo(false);
    setMessages([]);
    setSelectedMessages([]);
    setReplyToMessage(null);

    // Reset group unread count in local state
    updateGroupUnreadCount(group.id, 0);

    try {
      const res = await axios.get(`http://localhost:8000/group_messages/${group.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Use timestamps exactly as received from the database
      const formatted = res.data.map(m => ({
        id: m.id,
        content: m.content,
        timestamp: m.timestamp, // Use timestamp as received from database
        sender_id: m.sender_id,
        sender_username: m.sender_username,
        type: 'group',
        has_attachment: m.has_attachment,
        attachment_url: m.attachment_url,
        attachment_type: m.attachment_type,
        attachment_filename: m.attachment_filename,
        reply_to_message: m.reply_to_message,
        reactions: m.reactions,
        is_deleted: m.is_deleted
      }));

      setMessages(formatted);

      // Fetch group info
      await fetchGroupInfo(group.id);
    } catch (err) {
      console.log("Error fetching group messages:", err);
    }

    if (ws.current) ws.current.close();

    try {
      const wsUrl = `ws://localhost:8000/ws/group/${group.id}?token=${token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onmessage = (event) => {
        const data = event.data;
        console.log("Group WebSocket message received:", data);

        // Handle different message types
        if (data.startsWith("FILE:")) {
          const parts = data.split(':');
          const senderId = parseInt(parts[1]);
          const senderUsername = parts[2];
          const filename = parts[3];
          const fileType = parts[4];
          const fileUrl = parts[5];
          const fileMessage = parts[6] || '';
          const replyToId = parts[7] || null;
          const messageId = parts[8] || null;
          const timestamp = parts[9] || new Date().toISOString();

          const isOwnMessage = senderId === userId;

          setMessages(prev => [...prev, {
            id: messageId || Date.now(),
            content: fileMessage,
            timestamp: timestamp, // Use timestamp from server
            sender_id: senderId,
            sender_username: isOwnMessage ? 'You' : senderUsername,
            type: 'group',
            has_attachment: true,
            attachment_url: fileUrl,
            attachment_type: fileType,
            attachment_filename: filename,
            reply_to_message_id: replyToId
          }]);

        } else if (data.startsWith("REPLY:")) {
          const parts = data.split(':');
          const messageId = parts[1];
          const senderId = parseInt(parts[2]);
          const senderUsername = parts[3];
          const messageContent = parts[4];
          const replyToId = parts[5] || null;
          const timestamp = parts[6] || new Date().toISOString();

          const isOwnMessage = senderId === userId;

          setMessages(prev => [...prev, {
            id: messageId,
            content: messageContent,
            timestamp: timestamp, // Use timestamp from server
            sender_id: senderId,
            sender_username: isOwnMessage ? 'You' : senderUsername,
            type: 'group',
            reply_to_message_id: replyToId
          }]);

        } else if (data.startsWith("REACTION:")) {
          // Handle reaction updates
          const parts = data.split(':');
          const messageId = parseInt(parts[1]);
          const emoji = parts[2];
          const action = parts[3];

          setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
              const currentReactions = msg.reactions || {};
              if (action === 'add') {
                const userReactions = currentReactions[emoji] || [];
                if (!userReactions.includes(userId)) {
                  return {
                    ...msg,
                    reactions: {
                      ...currentReactions,
                      [emoji]: [...userReactions, userId]
                    }
                  };
                }
              } else {
                const updatedReactions = { ...currentReactions };
                if (updatedReactions[emoji]) {
                  updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== userId);
                  if (updatedReactions[emoji].length === 0) {
                    delete updatedReactions[emoji];
                  }
                }
                return { ...msg, reactions: updatedReactions };
              }
            }
            return msg;
          }));

        } else {
          // Regular text message - parse with timestamp
          const parts = data.split(':');
          const senderId = parseInt(parts[0]);
          const senderUsername = parts[1];
          const messageContent = parts[2];
          const timestamp = parts[3] || new Date().toISOString();

          const isOwnMessage = senderId === userId;

          setMessages(prev => [...prev, {
            id: Date.now(),
            content: messageContent,
            timestamp: timestamp, // Use timestamp from server
            sender_id: senderId,
            sender_username: isOwnMessage ? 'You' : senderUsername,
            type: 'group'
          }]);
        }
      };

      ws.current.onclose = () => console.log("Group WebSocket disconnected");
      ws.current.onerror = (error) => console.log("Group WebSocket error:", error);
    } catch (error) {
      console.log("Error creating group WebSocket:", error);
      showNotification("Failed to connect to group chat");
    }
  };

  // --- Show group info ---
  const handleShowGroupInfo = async () => {
    if (activeGroup) {
      await fetchGroupInfo(activeGroup.id);
      setShowGroupInfo(true);
    }
  };

  // --- Send message ---
  const sendMessage = () => {
    if (!message.trim()) return;

    if (replyToMessage) {
      sendReply();
      return;
    }

    if (activeFriend && ws.current) {
      // Individual chat
      ws.current.send(message);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: message,
        read: false,
        delivered: false,
        timestamp: new Date().toISOString(),
        sender_id: userId,
        sender_username: 'You',
        type: 'individual'
      }]);

      setLastMessages(prev => ({
        ...prev,
        [activeFriend.friend_id]: {
          content: message,
          timestamp: new Date().toISOString(),
          sender_id: userId,
          read: false,
          delivered: false
        }
      }));
    } else if (activeGroup && ws.current) {
      // Group chat
      ws.current.send(message);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: message,
        timestamp: new Date().toISOString(),
        sender_id: userId,
        sender_username: 'You',
        type: 'group'
      }]);
    }

    setMessage("");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Format last message for display
  const formatLastMessage = (friendId) => {
    const messageData = lastMessages[friendId];
    if (!messageData || !messageData.content) return "No messages yet";

    if (messageData.has_attachment) {
      const fileEmoji = getFileIcon(messageData.attachment_type, 'file');
      return `${fileEmoji} ${messageData.content}`;
    }

    const prefix = messageData.sender_id === userId ? "You: " : "";
    const message = prefix + messageData.content;

    return message.length > 30 ? message.substring(0, 30) + '...' : message;
  };

  const isLastMessageUnread = (friendId) => {
    const messageData = lastMessages[friendId];
    return messageData && messageData.sender_id !== userId && !messageData.read;
  };

  // Handle key press for message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (replyToMessage) {
        sendReply();
      } else {
        sendMessage();
      }
    }
  };

  // Get reply preview content
  const getReplyPreviewContent = () => {
    if (!replyToMessage) return '';
    
    if (replyToMessage.has_attachment) {
      return `Sent a ${replyToMessage.attachment_type}`;
    }
    
    const content = replyToMessage.content || replyToMessage.text || '';
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  // Get reply sender name
  const getReplySenderName = () => {
    if (!replyToMessage) return '';
    
    if (replyToMessage.sender_username) {
      return replyToMessage.sender_username;
    }
    
    return replyToMessage.sender_id === userId ? 'You' : 'Unknown';
  };

  return (
    <div className="study-room">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept="*/*"
      />

      {/* Notifications */}
      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className="notification">{n.message}</div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Group</h3>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Enter group description..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Select Friends</label>
                <div className="friends-selection">
                  {friends.map(friend => (
                    <div
                      key={friend.friend_id}
                      className={`friend-option ${selectedFriends.includes(friend.friend_id) ? 'selected' : ''}`}
                      onClick={() => toggleFriendSelection(friend.friend_id)}
                    >
                      <div className="user-avatar small">
                        {friend.friend_username.charAt(0).toUpperCase()}
                      </div>
                      <span className="friend-username">{friend.friend_username}</span>
                      {selectedFriends.includes(friend.friend_id) && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="btn-primary"
                disabled={!newGroupName.trim() || selectedFriends.length === 0}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Member to Group</h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Select Friend to Add</label>
                <div className="friends-selection">
                  {availableFriends.length === 0 ? (
                    <div className="empty-state">
                      <p>No friends available to add</p>
                    </div>
                  ) : (
                    availableFriends.map(friend => (
                      <div
                        key={friend.friend_id}
                        className="friend-option"
                        onClick={() => addMemberToGroup(friend.friend_id, friend.friend_username)}
                      >
                        <div className="user-avatar small">
                          {friend.friend_username.charAt(0).toUpperCase()}
                        </div>
                        <span className="friend-username">{friend.friend_username}</span>
                        <span className="add-icon">+</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowAddMember(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Group Confirmation Modal */}
      {showExitGroup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Exit Group</h3>
              <button
                onClick={() => setShowExitGroup(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="warning-message">
                <div className="warning-icon">⚠️</div>
                <h4>Are you sure you want to exit this group?</h4>
                <p>You will no longer be able to see group messages or participate in conversations.</p>
                {groupInfo?.current_user_is_admin && (
                  <div className="admin-warning">
                    <strong>Note:</strong> You are an admin of this group. If you are the last admin, you cannot exit until you assign another admin.
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowExitGroup(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={exitGroup}
                className="btn-danger"
              >
                Exit Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {emojiPickerVisible && (
        <div className="emoji-picker-overlay">
          <div className="emoji-picker">
            <div className="emoji-picker-header">
              <h4>Choose an emoji</h4>
              <button
                onClick={() => setEmojiPickerVisible(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="emoji-grid">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addEmojiToMessage(emoji)}
                  className="emoji-option"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Group Info Sidebar */}
      {showGroupInfo && groupInfo && (
        <div className="group-info-sidebar-overlay">
          <div className="group-info-sidebar">
            <div className="group-info-header">
              <button
                onClick={() => setShowGroupInfo(false)}
                className="back-btn"
              >
                ←
              </button>
              <h3>Group Info</h3>
            </div>

            <div className="group-info-content">
              <div className="group-avatar-large">
                <span className="group-icon-large">👥</span>
              </div>

              <div className="group-details-info">
                <h2>{groupInfo.name}</h2>
                <p className="group-description">{groupInfo.description || "No description"}</p>
                <div className="group-stats">
                  <span>{groupInfo.member_count} members</span>
                  <span>{groupInfo.admin_count} admins</span>
                </div>
              </div>

              {/* Exit Group Button */}
              <div className="exit-group-section">
                <button
                  onClick={() => setShowExitGroup(true)}
                  className="exit-group-btn"
                >
                  🚪 Exit Group
                </button>
              </div>

              <div className="group-members-section">
                <div className="section-header">
                  <h4>Members</h4>
                  {groupInfo.current_user_is_admin && (
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="add-member-btn"
                    >
                      + Add
                    </button>
                  )}
                </div>

                <div className="members-list">
                  {groupInfo.members.map(member => (
                    <div key={member.user_id} className="member-item">
                      <div className="member-avatar">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-details">
                        <span className="member-name">{member.username}</span>
                        <div className="member-roles">
                          {member.user_id === userId && <span className="role-you">You</span>}
                          {member.is_admin && <span className="role-admin">Admin</span>}
                        </div>
                      </div>
                      <div className="member-actions">
                        {groupInfo.current_user_is_admin && member.user_id !== userId && (
                          <>
                            {!member.is_admin ? (
                              <button
                                onClick={() => makeMemberAdmin(member.user_id, member.username)}
                                className="action-btn make-admin-btn"
                                title="Make Admin"
                              >
                                👑
                              </button>
                            ) : (
                              <button
                                onClick={() => removeMemberAdmin(member.user_id, member.username)}
                                className="action-btn remove-admin-btn"
                                title="Remove Admin"
                              >
                                👑
                              </button>
                            )}
                            <button
                              onClick={() => removeMemberFromGroup(member.user_id, member.username)}
                              className="action-btn remove-btn"
                              title="Remove from Group"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-brand">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h2>StudyRoom</h2>
          </div>
        </div>

        <div className="navbar-search-container" ref={searchContainerRef}>
          <div className="search-container">
            <h3 className="search-title">Connect with Friends</h3>
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search username..."
                className="search-input"
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
              />
              <button
                onClick={searchUsers}
                className="search-btn"
                disabled={!query.trim() || isSearching}
              >
                {isSearching ? (
                  <div className="spinner"></div>
                ) : (
                  <span className="search-icon">🔍</span>
                )}
              </button>
            </div>

            {users.length > 0 && (
              <div className="dropdown-suggestions">
                {users.map((u) => (
                  <div key={u.id} className="dropdown-user-card">
                    <span className="dropdown-username">{u.username}</span>
                    <button
                      onClick={() => sendRequest(u.id, u.username)}
                      className="dropdown-add-btn"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          <span className="logout-icon">🚪</span>
          Logout
        </button>
      </div>

      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Create Group Button */}
          <div className="sidebar-section">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="create-group-btn"
            >
              <span className="group-icon">👥</span>
              Create Group
            </button>
          </div>

          {/* Pending Requests */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3>Pending Requests</h3>
              <div className="request-count">{requests.length}</div>
            </div>
            <div className="requests-list">
              {requests.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📥</span>
                  <p>No pending requests</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="request-item">
                    <div className="user-avatar">
                      {req.sender_username.charAt(0).toUpperCase()}
                    </div>
                    <div className="request-details">
                      <span className="username">{req.sender_username}</span>
                      <button
                        onClick={() => acceptRequest(req.id, req.sender_username)}
                        className="accept-btn"
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Groups List */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3>Groups</h3>
              <div className="groups-count">{groups.length}</div>
            </div>
            <div className="groups-list">
              {groups.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">👥</span>
                  <p>No groups yet</p>
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    className={`group-item ${activeGroup?.id === group.id ? 'active' : ''} ${groupUnreadCounts[group.id] > 0 ? 'unread' : ''}`}
                    onClick={() => startGroupChat(group)}
                  >
                    <div className="group-avatar">
                      <span className="group-icon">👥</span>
                    </div>
                    <div className="group-details">
                      <div className="group-header">
                        <span className={`group-name ${groupUnreadCounts[group.id] > 0 ? 'group-name-bold' : ''}`}>
                          {group.name}
                        </span>
                        <span className="message-time" title={getExactTime(group.last_message_time)}>
                          {formatSidebarTime(group.last_message_time)}
                        </span>
                      </div>
                      <div className="group-info">
                        <span className={`last-message ${groupUnreadCounts[group.id] > 0 ? 'message-bold' : 'message-read'}`}>
                          {group.last_message_has_attachment ? (
                            <>
                              {getFileIcon(group.last_message_attachment_type, 'file')}
                              {group.last_message}
                            </>
                          ) : (
                            group.last_message || "No messages yet"
                          )}
                        </span>
                        <span className="member-count">
                          {group.member_count} members
                        </span>
                      </div>
                    </div>
                    {groupUnreadCounts[group.id] > 0 && (
                      <div className={`unread-badge ${groupUnreadCounts[group.id] === 1 ? 'new-message' : ''}`}>
                        {groupUnreadCounts[group.id] > 99 ? '99+' : groupUnreadCounts[group.id]}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Friends List with Search */}
          <div className="sidebar-section">
            <div className="section-header">
              <h3>Chats</h3>
              <div className="friends-count">{filteredFriends.length}</div>
            </div>
            
            {/* Friend Search Bar */}
            <div className="friend-search-container">
              <input
                type="text"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="friend-search-input"
              />
            </div>

            <div className="friends-list">
              {filteredFriends.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">👥</span>
                  <p>{friendSearchQuery ? "No friends found" : "No friends yet"}</p>
                </div>
              ) : (
                filteredFriends.map((f) => (
                  <div
                    key={f.friend_id}
                    className={`friend-item ${activeFriend?.friend_id === f.friend_id ? 'active' : ''} ${unreadCounts[f.friend_id] > 0 ? 'unread' : ''}`}
                    onClick={() => startChat(f)}
                  >
                    <div className="user-avatar online">
                      {f.friend_username.charAt(0).toUpperCase()}
                    </div>
                    <div className="friend-details">
                      <div className="friend-header">
                        <span className={`username ${unreadCounts[f.friend_id] > 0 ? 'username-bold' : ''}`}>
                          {f.friend_username}
                        </span>
                        <span className={`message-time ${unreadCounts[f.friend_id] > 0 ? 'time-bold' : ''}`} 
                              title={getExactTime(lastMessages[f.friend_id]?.timestamp)}>
                          {formatSidebarTime(lastMessages[f.friend_id]?.timestamp)}
                        </span>
                      </div>
                      <div className="message-preview">
                        <span className={`last-message ${unreadCounts[f.friend_id] > 0 || isLastMessageUnread(f.friend_id) ? 'message-bold' : 'message-read'}`}>
                          {formatLastMessage(f.friend_id)}
                        </span>
                        {unreadCounts[f.friend_id] > 0 && (
                          <div className={`unread-badge ${unreadCounts[f.friend_id] === 1 ? 'new-message' : ''}`}>
                            {unreadCounts[f.friend_id] > 99 ? '99+' : unreadCounts[f.friend_id]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {activeFriend || activeGroup ? (
            <div className="chat-container">
              {/* Selection Mode Header */}
              {selectedMessages.length > 0 && (
                <div className="selection-mode">
                  <div className="selection-info">
                    {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} selected
                  </div>
                  <div className="selection-actions">
                    <button
                      onClick={clearSelection}
                      className="selection-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="chat-header">
                <div className="chat-user">
                  <div className={`user-avatar large ${activeFriend ? 'online' : 'group'}`}>
                    {activeFriend
                      ? activeFriend.friend_username.charAt(0).toUpperCase()
                      : <span className="group-icon">👥</span>
                    }
                  </div>
                  <div>
                    <h3>{activeFriend ? activeFriend.friend_username : activeGroup?.name}</h3>
                    <span className="status">
                      {activeFriend ? 'Online' : `${activeGroup?.member_count} members`}
                    </span>
                  </div>
                </div>
                <div className="chat-header-actions">
                  {activeGroup && (
                    <button
                      onClick={handleShowGroupInfo}
                      className="group-info-btn"
                    >
                      Group Info
                    </button>
                  )}
                </div>
              </div>

              <div className="messages-container">
                {messages.map((msg, idx) => renderMessage(msg, idx))}
                <div ref={chatEndRef} />
              </div>

              {/* Reply Preview */}
              {replyToMessage && (
                <div className="reply-preview">
                  <div className="reply-preview-content">
                    <div className="reply-preview-header">
                      <span>Replying to {getReplySenderName()}</span>
                      <button onClick={cancelReply}>×</button>
                    </div>
                    <div className="reply-preview-message">
                      {getReplyPreviewContent()}
                    </div>
                  </div>
                </div>
              )}

              <div className="message-input-container">
                <button
                  onClick={triggerFileInput}
                  className="attach-btn"
                  disabled={uploadingFile}
                  title="Attach file"
                >
                  {uploadingFile ? (
                    <div className="spinner small"></div>
                  ) : (
                    <span className="attach-icon">📎</span>
                  )}
                </button>

                <button
                  onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                  className="emoji-btn"
                  title="Add emoji"
                >
                  😊
                </button>

                <input
                  ref={messageInputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={replyToMessage ? "Type your reply..." : "Type your message..."}
                  className="message-input"
                  onKeyDown={handleKeyPress}
                  disabled={uploadingFile}
                />

                <button
                  onClick={replyToMessage ? sendReply : sendMessage}
                  className="send-btn"
                  disabled={!message || uploadingFile}
                >
                  <span className="send-icon">
                    {replyToMessage ? '↩️' : '↑'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-content">
                <div className="welcome-icon">💬</div>
                <h2>Welcome to StudyRoom</h2>
                <p>Select a friend or group to start chatting!</p>
                <div className="feature-highlights">
                  <div className="feature-item">
                    <span className="feature-icon">🎉</span>
                    <span>React with emojis</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">↩️</span>
                    <span>Reply to messages</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🗑️</span>
                    <span>Delete individual messages</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📎</span>
                    <span>Share files</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;