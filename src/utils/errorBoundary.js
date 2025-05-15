import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error to Sentry or another service here
    if (this.props.onError) this.props.onError(error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <Text style={styles.errorDetails}>{this.state.error?.toString()}</Text>
          <Button title="Reload" onPress={this.handleReload} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  errorDetails: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ErrorBoundary; 