import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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
  last_message?: string;
};

export default function AdminChatManagement({ navigation }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        } else {
          fetchAllConversations(null);
        }
      } catch (error) {
        console.error('Lỗi lấy userId từ AsyncStorage:', error);
        fetchAllConversations(null);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchAllConversations(userId);
    }
  }, [userId]);

  const fetchAllConversations = async (currentUserId: number | null) => {
    setLoading(true);
    console.log('Fetching conversations với userId =', currentUserId);

    let url = `${BASE_URL}/api/conversations1`;
    if (currentUserId !== null) {
      url += `?userId=${currentUserId}`;
    }

    try {
      const res = await axios.get<Conversation[]>(url);
      setConversations(res.data);
    } catch (error) {
      console.error('Fetch all conversations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('ChatBoxAdmin', {
          conversationId: item.id,
          userId: item.user_id,
          currentUserId: userId,
          isAdmin: true,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={styles.title}>Cuộc Trò Chuyện Với User {item.user_id}</Text>
        <Text style={styles.userIdText}>User ID: {item.user_id}</Text>
        
        <Text style={styles.createdAtText}>
          Ngày tạo: {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => fetchAllConversations(userId)}
        activeOpacity={0.7}
      >
        <Text style={styles.refreshButtonText}>Làm mới danh sách</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#333333" style={styles.loader} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={styles.flatList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyListText}>Chưa có cuộc trò chuyện nào</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light gray for a clean backdrop
  },
  refreshButton: {
    backgroundColor: '#333333', // Dark gray for a sleek button
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 24,
  },
  flatList: {
    flex: 1,
  },
  item: {
    backgroundColor: '#ffffff', // White for conversation cards
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light gray border for definition
  },
  itemContent: {
    padding: 16,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000', // Pure black for strong contrast
    marginBottom: 6,
  },
  userIdText: {
    fontSize: 14,
    color: '#333333', // Dark gray for secondary text
    marginBottom: 4,
  },
  lastMessageText: {
    fontSize: 14,
    color: '#333333', // Dark gray for secondary text
    marginBottom: 4,
  },
  createdAtText: {
    fontSize: 12,
    color: '#666666', // Medium gray for timestamps
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666666', // Medium gray for empty state
    fontSize: 16,
    fontWeight: '500',
  },
});