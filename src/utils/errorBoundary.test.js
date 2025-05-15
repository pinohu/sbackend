import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorBoundary from './errorBoundary';
import { Text } from 'react-native';

describe('ErrorBoundary', () => {
  it('renders fallback UI on error', () => {
    const ProblemChild = () => {
      throw new Error('Test error');
    };
    const { getByText } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(getByText('Something went wrong.')).toBeTruthy();
    expect(getByText(/Test error/)).toBeTruthy();
    expect(getByText('Reload')).toBeTruthy();
  });
}); 