import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { suiteDashApi } from '../services/suiteDashApi';

const ContactDetailsScreen = ({ route }) => {
  const { contactId } = route.params;
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContact();
  }, [contactId]);

  const loadContact = async () => {
    try {
      setLoading(true);
      const data = await suiteDashApi.getContactById(contactId);
      setContact(data.contact || data);
      setError(null);
    } catch (err) {
      setError('Failed to load contact details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Contact not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{contact.first_name} {contact.last_name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{contact.email}</Text>
      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{contact.phone || 'N/A'}</Text>
      {/* Add more fields as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginTop: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ContactDetailsScreen; 