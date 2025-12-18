import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../ipconfig';

type Props = {
  route: any;
  navigation: any;
};

type Message = {
  id: number;
  conversation_id: number;
  user_id?: number;
  message: string;
  created_at: string;
  role: number | null;
  name: string;
};

export default function ChatBoxAdmin({ route }: Props) {
  const { conversationId, adminId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const parsedUserId = parseInt(storedUserId, 10);
          setUserId(parsedUserId);
          console.log('userId lấy từ AsyncStorage:', parsedUserId);
        } else {
          console.log('Chưa có userId trong AsyncStorage');
        }
      } catch (error) {
        console.error('Lỗi lấy userId từ AsyncStorage:', error);
      }
    };
    fetchUserId();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/messagesadmin/${conversationId}`);
      setMessages(res.data);
      console.log('Tin nhắn tải về:', res.data);
    } catch (err) {
      console.error('Lỗi khi tải tin nhắn:', err);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    console.log('Gửi tin nhắn với userId:', userId);

    try {
      await axios.post(`${BASE_URL}/api/messagesadmin`, {
        conversation_id: conversationId,
        user_id: userId ?? adminId,
        message: input,
        role: 1,
      });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 1 ? styles.adminMessage : styles.userMessage,
      ]}
    >
      <Text style={styles.senderName}>
        {item.name} {item.role === 1 ? '(Admin)' : '(User)'}
      </Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Nhập tin nhắn...'
          value={input}
          onChangeText={setInput}
          placeholderTextColor='#8ab4f8'
        />
        <TouchableOpacity
          style={[styles.sendButton, input.trim() === '' && styles.disabledButton]}
          onPress={sendMessage}
          disabled={input.trim() === ''}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  messageBubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  adminMessage: {
    backgroundColor: '#ffff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  userMessage: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  senderName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  timestamp: {
    fontSize: 10,
    color: '#666666',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    color: '#000000',
  },
  sendButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
});
