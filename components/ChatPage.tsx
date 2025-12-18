import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../ipconfig';

type Props = {
  navigation: any;
};

type Conversation = {
  id: number;
  user_id: number;
  created_at: string;
};

export default function ChatPage({ navigation }: Props) {
  const [userId, setUserId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('userId').then((id) => {
      if (id) {
        const uid = parseInt(id, 10);
        setUserId(uid);
        fetchConversations(uid);
      }
    });
  }, []);

  const fetchConversations = (uid: number) => {
    axios
      .get<Conversation[]>(`${BASE_URL}/api/conversations/user/${uid}`)
      .then((res) => {
        setConversations(res.data);
      })
      .catch((error) => {
        console.error('Fetch conversations error:', error);
      });
  };

  const createConversation = () => {
    if (!userId) {
      console.warn('UserId chưa được load');
      return;
    }

    console.log('Creating conversation for user_id:', userId);

    axios
      .post(`${BASE_URL}/api/conversations`, { user_id: userId })
      .then((res) => {
        const newConv = res.data;
        console.log('New conversation created:', newConv);
        fetchConversations(userId);
        navigation.navigate('Chat Box', {
          conversationId: newConv.id,
          userId,
        });
      })
      .catch((error) => {
        console.error('Create conversation error:', error);
      });
  };

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