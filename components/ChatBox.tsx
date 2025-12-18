import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../ipconfig';

type Message = {
  id: number;
  conversation_id: number;
  user_id: number;
  message: string;
  created_at: string;
  name: string;
  role: number | null;
};

type Props = {
  route: {
    params: {
      conversationId: number;
      userId: number;
    };
  };
};

export default function ChatBox({ route }: Props) {
  const { conversationId, userId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = () => {
    axios
      .get<Message[]>(`${BASE_URL}/api/messages/${conversationId}`)
      .then((res) => {
        console.log('Tin nhắn nhận:', res.data);
        setMessages(res.data);
      })
      .catch((error) => console.error('Load messages error:', error));
  };

  const sendMessage = () => {
    if (newMsg.trim() === '') return;

    axios
      .post(`${BASE_URL}/api/messages`, {
        conversation_id: conversationId,
        user_id: userId,
        message: newMsg.trim(),
      })
      .then(() => {
        setNewMsg('');
        loadMessages();
      })
      .catch((error) => console.error('Send message error:', error));
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 1000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      try {
        flatListRef.current.scrollToIndex({ index: messages.length - 1, animated: true });
      } catch {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [messages]);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.user_id === userId;
    return (
      <View style={[styles.msgContainer, isUser ? styles.msgRight : styles.msgLeft]}>
        <Text style={styles.msgName}>
          {item.name} {item.role === 1 ? '(Admin)' : '(User)'}
        </Text>
        <Text style={styles.msgText}>{item.message}</Text>
        <Text style={styles.msgTime}>{new Date(item.created_at).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.messageCount}>Số tin nhắn: {messages.length}</Text>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        onScrollToIndexFailed={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMsg}
          onChangeText={setNewMsg}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#8ab4f8"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={newMsg.trim() === ''}
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
    backgroundColor:'rgb(241, 235, 251)', // Light, bright blue background (matches ChatPage)
  },
  messageCount: {
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color:'rgb(1, 1, 1)', // Bright navy blue
    backgroundColor: '#f0f8ff', // Very light blue
  },
  flatListContent: {
    padding: 12,
    paddingBottom: 20,
  },
  msgContainer: {
    maxWidth: '75%',
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  msgLeft: {
    backgroundColor: '#f0f8ff', // Very light blue for received messages
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4, // Sharp corner for tail effect
  },
  msgRight: {
    backgroundColor:'rgb(200, 178, 217)', // Bright sky blue for sent messages
    alignSelf: 'flex-end',
    borderTopRightRadius: 4, // Sharp corner for tail effect
  },
  msgName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#6A0DAD', // Bright navy blue
    marginBottom: 4,
  },
  msgText: {
    fontSize: 16,
    color: '#001f3f', // Dark navy for readability
  },
  msgTime: {
    fontSize: 10,
    color: '#6A0DAD', // Bright steel blue
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor:'rgb(217, 203, 227)', // Very light blue
    borderTopWidth: 1,
    borderColor: '#6A0DAD', // Light blue border
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6A0DAD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#001f3f',
  },
  sendButton: {
    backgroundColor: '#6A0DAD', // Bright sky blue
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});