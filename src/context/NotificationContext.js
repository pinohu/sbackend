import React, { createContext, useState, useEffect, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          await getFCMToken();
        }
      } catch (error) {
        console.error('Permission request error:', error);
      } finally {
        setLoading(false);
      }
    };
    const loadNotifications = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem('notifications');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };
    requestUserPermission();
    loadNotifications();
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      const notification = {
        id: remoteMessage.messageId,
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        timestamp: new Date().toISOString(),
        read: false,
      };
      addNotification(notification);
      Alert.alert(notification.title, notification.body);
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      // Handle navigation if needed
    });
    messaging().getInitialNotification().then(remoteMessage => {
      // Handle navigation if needed
    });
    return () => {
      unsubscribeForeground();
    };
  }, []);

  const getFCMToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      setToken(fcmToken);
      await AsyncStorage.setItem('fcmToken', fcmToken);
      return fcmToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  const addNotification = async (notification) => {
    try {
      const updatedNotifications = [notification, ...notifications];
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map(item =>
        item.id === notificationId ? { ...item, read: true } : item
      );
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      setNotifications([]);
      await AsyncStorage.removeItem('notifications');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        token,
        notifications,
        loading,
        addNotification,
        markAsRead,
        clearNotifications,
        refreshToken: getFCMToken,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 