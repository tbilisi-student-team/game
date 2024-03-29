import React, { Component, ErrorInfo, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
}

type State = {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error(error);

    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Error</h1>;
    }

    return this.props.children;
  }
}
