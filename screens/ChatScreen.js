import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; //

export default function ChatScreen() {
  const route = useRoute();
  const flatListRef = useRef(null);
  const { name, avatar } = route.params || { name: "Patriot Driver", avatar: null };
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // 1. INITIALIZE CHAT ON MATCH
  useFocusEffect(
    useCallback(() => {
      setMessages([
        { id: '1', text: `System: Connected with ${name}`, isSystem: true },
      ]);

      const timer = setTimeout(() => {
        const driverGreeting = {
          id: '2',
          text: `Hey! I'm heading to the JC circular now. Where exactly are you standing?`,
          sender: 'driver',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, driverGreeting]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1500);

      return () => clearTimeout(timer);
    }, [name])
  );

  // 2. HANDLE USER SENDING MESSAGES
  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 3. SIMULATED DRIVER RESPONSE (LIVE SYNC FEEL)
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: "Got it, I see you! I'm in the green Camry. 🚗",
        sender: 'driver',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  const renderMessage = ({ item }) => {
    if (item.isSystem) return <Text style={styles.systemMsg}>{item.text}</Text>;
    const isMe = item.sender === 'me';
    
    return (
      <View style={[styles.msgContainer, isMe ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
        <View style={[styles.msgBubble, isMe ? styles.myMsg : styles.theirMsg]}>
          <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.theirMsgText]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: avatar || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
        <View>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerStatus}>Arriving in 2 mins</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* MESSAGE INPUT AREA */}
      <View style={styles.inputArea}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Message your Patriot..."
            placeholderTextColor="#BBB"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="arrow-up" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 15, borderWidth: 2, borderColor: '#006633' },
  headerName: { fontSize: 18, fontWeight: '900', color: '#006633' },
  headerStatus: { fontSize: 10, fontWeight: '700', color: '#FFCC33', letterSpacing: 1 },
  chatList: { padding: 25, paddingBottom: 40 },
  systemMsg: { textAlign: 'center', color: '#BBB', fontSize: 10, fontWeight: '800', marginVertical: 20, letterSpacing: 1 },
  msgContainer: { marginBottom: 15 },
  msgBubble: { maxWidth: '80%', padding: 16, borderRadius: 24 },
  myMsg: { backgroundColor: '#006633', borderBottomRightRadius: 4 },
  theirMsg: { backgroundColor: '#F0F9F4', borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  myMsgText: { color: '#FFF' },
  theirMsgText: { color: '#006633' },
  timestamp: { fontSize: 8, fontWeight: '700', color: '#CCC', marginTop: 4, marginHorizontal: 5 },
  inputArea: { paddingHorizontal: 20, paddingBottom: 35, paddingTop: 10, backgroundColor: '#FFF' },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8F8F8', 
    borderRadius: 30, 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  input: { flex: 1, paddingHorizontal: 15, color: '#333', fontWeight: '600', fontSize: 15, maxHeight: 100 },
  sendBtn: { 
    backgroundColor: '#006633', 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
