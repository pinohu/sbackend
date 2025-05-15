import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SuiteDashProvider, useSuiteDash } from './SuiteDashContext';
import * as api from '../services/suiteDashApi';

jest.mock('../services/suiteDashApi');

const TestComponent = () => {
  const { isLoading, isAuthenticated, error, refreshData } = useSuiteDash();
  return (
    <>
      <Text testID="loading">{isLoading ? 'loading' : 'not-loading'}</Text>
      <Text testID="auth">{isAuthenticated ? 'auth' : 'not-auth'}</Text>
      <Text testID="error">{error || 'no-error'}</Text>
      <Text testID="refresh">{typeof refreshData === 'function' ? 'has-refresh' : 'no-refresh'}</Text>
    </>
  );
};

describe('SuiteDashProvider', () => {
  it('provides context values', async () => {
    api.suiteDashApi.checkAuth.mockResolvedValue(true);
    const { getByTestId } = render(
      <SuiteDashProvider>
        <TestComponent />
      </SuiteDashProvider>
    );
    await waitFor(() => expect(getByTestId('loading').props.children).toBe('not-loading'));
    expect(getByTestId('auth').props.children).toBe('auth');
    expect(getByTestId('error').props.children).toBe('no-error');
    expect(getByTestId('refresh').props.children).toBe('has-refresh');
  });
}); 