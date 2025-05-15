import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUITEDASH_PUBLIC_ID, SUITEDASH_SECRET_KEY } from '@env';

const API_BASE_URL = 'https://app.suitedash.com/secure-api';
const PUBLIC_ID = SUITEDASH_PUBLIC_ID;
const SECRET_KEY = SUITEDASH_SECRET_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Public-ID': PUBLIC_ID,
    'X-Secret-Key': SECRET_KEY
  },
  timeout: 15000
});

// Axios response interceptor for error/rate limit handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 429) {
      console.log('Rate limit exceeded. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Caching helpers
const cacheData = async (key, data, expirationMinutes = 10) => {
  try {
    const item = {
      data,
      expiry: Date.now() + expirationMinutes * 60 * 1000
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

const getCachedData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return null;
    const item = JSON.parse(value);
    if (Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const suiteDashApi = {
  // Authentication check
  async checkAuth() {
    try {
      const response = await apiClient.get('/contacts?per_page=1');
      return response.status === 200;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  },
  // Contacts
  async getContacts(params = {}, useCache = true) {
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const cacheKey = `contacts_p${page}_n${perPage}`;
    if (useCache) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiClient.get(`/contacts?page=${page}&per_page=${perPage}`);
      if (useCache) await cacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  async getContactById(id, useCache = true) {
    const cacheKey = `contact_${id}`;
    if (useCache) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiClient.get(`/contact/${id}`);
      if (useCache) await cacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },
  async createContact(contactData) {
    try {
      const response = await apiClient.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },
  // Projects
  async getProjects(params = {}, useCache = true) {
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const cacheKey = `projects_p${page}_n${perPage}`;
    if (useCache) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiClient.get(`/projects?page=${page}&per_page=${perPage}`);
      if (useCache) await cacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  async getProjectById(id, useCache = true) {
    const cacheKey = `project_${id}`;
    if (useCache) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiClient.get(`/projects/${id}`);
      if (useCache) await cacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },
  async createProject(projectData) {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  // Files
  async getFiles(params = {}, useCache = true) {
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const cacheKey = `files_p${page}_n${perPage}`;
    if (useCache) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiClient.get(`/files?page=${page}&per_page=${perPage}`);
      if (useCache) await cacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  },
  async uploadFile(fileData) {
    try {
      const response = await apiClient.post('/files', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
  // Tasks
  async getTasks(params = {}, useCache = true) {
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const cacheKey = `tasks_p${page}_n${perPage}`;
    if (useCache) {
      const cached = await getCachedData(cacheKey);
      if (cached) return cached;
    }
    try {
      const response = await apiClient.get(`/tasks?page=${page}&per_page=${perPage}`);
      if (useCache) await cacheData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  // Clear all cached data
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const suiteDashKeys = keys.filter(key =>
        key.startsWith('contacts_') || 
        key.startsWith('contact_') || 
        key.startsWith('projects_') || 
        key.startsWith('project_') || 
        key.startsWith('files_') ||
        key.startsWith('tasks_')
      );
      await AsyncStorage.multiRemove(suiteDashKeys);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
}; 