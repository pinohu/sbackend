import axios from 'axios';
import { SUITEDASH_PUBLIC_ID, SUITEDASH_SECRET_KEY } from '@env';

// API credentials are now loaded from .env using react-native-dotenv
const API_BASE_URL = 'https://app.suitedash.com/secure-api';
const PUBLIC_ID = SUITEDASH_PUBLIC_ID;
const SECRET_KEY = SUITEDASH_SECRET_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'X-Public-ID': PUBLIC_ID,
    'X-Secret-Key': SECRET_KEY
  }
});

export const suiteDashApi = {
  async getContacts() {
    try {
      const response = await apiClient.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  async getContactById(id) {
    try {
      const response = await apiClient.get(`/contact/${id}`);
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
  async getProjects() {
    try {
      const response = await apiClient.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  async getProjectFiles(projectId) {
    try {
      const response = await apiClient.get(`/files?project_id=${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching files for project ${projectId}:`, error);
      throw error;
    }
  },
  async getProjectById(id) {
    try {
      const response = await apiClient.get(`/projects/${id}`);
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
  async updateProject(id, projectData) {
    try {
      const response = await apiClient.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }
  },
  async deleteProject(id) {
    try {
      const response = await apiClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  },
  async getFiles(params = {}) {
    try {
      const response = await apiClient.get('/files', { params });
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
  async getTasks() {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  async updateTask(id, taskData) {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },
  async deleteTask(id) {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  }
}; 