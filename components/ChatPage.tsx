// ========== IMPORTS ==========
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../ipconfig';

// ========== TYPES ==========
type Props = {
  navigation: any;
};

type Conversation = {
  id: number;
  user_id: number;
  created_at: string;
};

// ========== COMPONENT ==========
export default function ChatPage({ navigation }: Props) {
  // ========== STATE MANAGEMENT ==========
  const [userId, setUserId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // ========== EFFECTS ==========
  // Lấy userId và load danh sách cuộc trò chuyện
  useEffect(() => {
    AsyncStorage.getItem('userId').then((id) => {
      if (id) {
        const uid = parseInt(id, 10);
        setUserId(uid);
        fetchConversations(uid);
      }
    });
  }, []);

  // ========== FUNCTIONS ==========
  // Lấy danh sách cuộc trò chuyện của user
  const fetchConversations = (uid: number) => {
    axios
      .get<Conversation[]>(`${BASE_URL}/api/conversations/user/${uid}`)
      .then((res) => {
        setConversations(res.data);
      })
      .catch((error) => {
      });
  };

  // ========== HANDLERS ==========
  // Tạo cuộc trò chuyện mới với admin
  const createConversation = () => {
    if (!userId) {
      return;
    }


    axios
      .post(`${BASE_URL}/api/conversations`, { user_id: userId })
      .then((res) => {
        const newConv = res.data;
        fetchConversations(userId);
        navigation.navigate('Chat Box', {
          conversationId: newConv.id,
          userId,
        });
      })
      .catch((error) => {
      });
  };

  // ========== RENDER FUNCTIONS ==========
  // Render conversation item
  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate('Chat Box', {
          conversationId: item.id,
          userId,
        })
      }
      activeOpacity={0.7}
    >
      <Text style={styles.chatWithAdminText}>Chat với ADMIN</Text>
      <Text style={styles.conversationDate}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  // ========== RENDER ==========
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.createButton, !userId && styles.disabledButton]}
        onPress={createConversation}
        disabled={!userId}
      >
        <Text style={styles.createButtonText}>Tạo Cuộc Trò Chuyện</Text>
      </TouchableOpacity>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderConversation}
        style={styles.flatList}
        ListEmptyComponent={<Text style={styles.emptyListText}>Không có cuộc trò chuyện nào</Text>}
      />
    </View>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa', // Light neutral background
  },
  createButton: {
    backgroundColor: '#6A0DAD', // Vibrant blue
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#adb5bd',
    opacity: 0.6,
  },
  flatList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chatWithAdminText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  conversationDate: {
    color: '#6c757d',
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 8,
    textAlign: 'right',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 24,
  },
});