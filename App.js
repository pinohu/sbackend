import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ContactsScreen from './screens/ContactsScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import FilesScreen from './screens/FilesScreen';
import TasksScreen from './screens/TasksScreen';
import ContactDetailsScreen from './screens/ContactDetailsScreen';
import { View, Text } from 'react-native';
import ErrorBoundary from './src/utils/errorBoundary';
import * as Sentry from '@sentry/react-native';
import { SENTRY_DSN } from '@env';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const Stack = createStackNavigator();

const ProjectDetailsScreen = ({ route }) => {
  const { projectId } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Project Details for ID: {projectId}</Text>
    </View>
  );
};

const FileDetailsScreen = ({ route }) => {
  const { fileId } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>File Details for ID: {fileId}</Text>
    </View>
  );
};

const TaskDetailsScreen = ({ route }) => {
  const { taskId } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Task Details for ID: {taskId}</Text>
    </View>
  );
};

function logErrorToSentry(error, info) {
  Sentry.captureException(error, { extra: info });
}

export default function App() {
  return (
    <ErrorBoundary onError={logErrorToSentry}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Contacts">
          <Stack.Screen name="Contacts" component={ContactsScreen} />
          <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{ title: 'Contact Details' }} />
          <Stack.Screen name="Projects" component={ProjectsScreen} />
          <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} options={{ title: 'Project Details' }} />
          <Stack.Screen name="Files" component={FilesScreen} />
          <Stack.Screen name="FileDetails" component={FileDetailsScreen} options={{ title: 'File Details' }} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
} 