import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar'; // ✅ Import global navbar

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

// ✅ FIXED: Using the Emulator Bridge IP
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Namaste! 🙏 I am Sanjeevani AI. How can I assist you today?', sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isGuestMode, setIsGuestMode] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) setUserName(storedName);

        // ✅ Check if the user entered via the Family (Guest) button
        const guestFlag = await AsyncStorage.getItem('isGuest');
        if (guestFlag === 'true') {
          setIsGuestMode(true);
          setMessages([
            { id: '1', text: 'Namaste! 🙏 I am Sanjeevani AI. I see you are in Family Mode. How can I assist with your family member\'s health today?', sender: 'ai' }
          ]);
        }
      } catch (e) {
        console.error("Session Error", e);
      }
    };
    loadSession();
  }, []);

  const sendMessage = async () => {
    const userQuery = inputText.trim();
    if (!userQuery || loading) return;

    const userMsg = { id: Date.now().toString(), text: userQuery, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // ✅ FIXED: Changed API_URL to API_BASE_URL and pointed to /chat/
      // Pass a special flag to Django if in guest mode, so AI doesn't use the main user's Prakriti data!
      const response = await axios.post(`${API_BASE_URL}/chat/`, {
        message: userQuery,
        username: userName,
        isGuest: isGuestMode
      }, {
        timeout: 25000, // Increased timeout for AI generation
        headers: { 'Content-Type': 'application/json' }
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: response.data.response || "I am analyzing your query...",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.log("Chat Error:", error.message);

      let errorDisplay = "⚠️ **Sanjeevani is Offline**\n\nI can't reach the server. Please check if your Django terminal is running.";

      if (error.response?.status === 404) {
        errorDisplay = "⚠️ **URL Mismatch (404)**\nServer is running but the chatbot address is wrong. Check your urls.py.";
      }

      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        text: errorDisplay,
        sender: 'ai',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && <View style={styles.avatar}><Text style={{fontSize: 12}}>🌿</Text></View>}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Markdown style={isUser ? userMarkdownStyles : aiMarkdownStyles}>
            {item.text}
          </Markdown>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sanjeevani AI Chat</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="small" color={THEME_COLOR} />
            <Text style={styles.loadingText}>Sanjeevani is thinking...</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type your health query..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#999"
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && { opacity: 0.6 }]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ✅ Add the global Bottom Nav Bar here */}
      <BottomNavBar navigation={navigation} activeScreen="Chat" />

    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAF8' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
      paddingBottom: 15,
      backgroundColor: THEME_COLOR,
      elevation: 8,
    },
    backButton: { padding: 5 },
    backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

    // ✅ Increased paddingBottom to 100 so final chat messages aren't hidden behind the navbar
    chatList: { padding: 15, paddingBottom: 100 },

    messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
    userRow: { justifyContent: 'flex-end' },
    aiRow: { justifyContent: 'flex-start' },
    avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    bubble: { maxWidth: '82%', padding: 13, borderRadius: 18, elevation: 2 },
    userBubble: { backgroundColor: THEME_COLOR, borderBottomRightRadius: 2 },
    aiBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 2 },
    loadingArea: { flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginBottom: 15 },
    loadingText: { marginLeft: 10, fontSize: 13, color: '#666', fontStyle: 'italic' },

    // ✅ Modified: Added paddingBottom 100 to push the input box above the absolute BottomNavBar
    inputWrapper: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: '#FFF',
      borderTopWidth: 1,
      borderTopColor: '#EEE',
      alignItems: 'center',
      paddingBottom: Platform.OS === 'ios' ? 100 : 85,
    },
    input: { flex: 1, backgroundColor: '#F0F2F0', borderRadius: 25, paddingHorizontal: 18, paddingVertical: 10, fontSize: 15, color: '#333' },
    sendButton: { marginLeft: 10, backgroundColor: THEME_COLOR, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 25 },
    sendButtonText: { color: '#FFF', fontWeight: 'bold' },
  });

const aiMarkdownStyles = { body: { color: '#333', fontSize: 15, lineHeight: 22 } };
const userMarkdownStyles = { body: { color: '#FFF', fontSize: 15, lineHeight: 22 } };

export default ChatScreen;