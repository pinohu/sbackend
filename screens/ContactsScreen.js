import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { suiteDashApi } from '../services/suiteDashApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAGE_SIZE = 20;

const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadContacts(1, true);
  }, []);

  const loadContacts = async (pageToLoad = 1, initial = false) => {
    if (!initial && !hasMore) return;
    try {
      if (initial) setLoading(true);
      const cached = await AsyncStorage.getItem('contacts');
      if (initial && cached) {
        setContacts(JSON.parse(cached));
      }
      const data = await suiteDashApi.getContacts({ page: pageToLoad, per_page: PAGE_SIZE });
      const newContacts = data.contacts || [];
      setContacts(prev => (pageToLoad === 1 ? newContacts : [...prev, ...newContacts]));
      setHasMore(newContacts.length === PAGE_SIZE);
      setError(null);
      if (pageToLoad === 1) {
        await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
      }
    } catch (err) {
      setError('Failed to load contacts. Please try again.');
      console.error(err);
    } finally {
      if (initial) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadContacts(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadContacts(nextPage);
    }
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetails', { contactId: item.id })}
    >
      <Text style={styles.contactName}>{item.first_name} {item.last_name}</Text>
      <Text style={styles.contactEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContactItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts found</Text>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contactItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});

export default ContactsScreen; 