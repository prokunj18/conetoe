import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallbackType?: 'game' | 'ui';
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Game Error Boundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
    this.props.onRetry?.();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isGameError = this.props.fallbackType === 'game';
      
      return (
        <div className={`${isGameError ? 'min-h-screen' : 'w-full h-full min-h-[200px]'} flex items-center justify-center bg-gradient-to-br from-destructive/10 to-background p-4`}>
          <div className="text-center space-y-4 max-w-md">
            <div className="relative">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto animate-pulse" />
              <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground">
              {isGameError ? 'Game Error' : 'UI Error'}
            </h3>
            
            <p className="text-muted-foreground text-sm">
              {isGameError 
                ? 'Something went wrong with the game. Your progress has been saved.'
                : 'A UI component encountered an error.'}
            </p>
            
            {this.state.errorMessage && (
              <p className="text-xs text-destructive/70 font-mono bg-destructive/5 p-2 rounded">
                {this.state.errorMessage}
              </p>
            )}
            
            <div className="flex gap-3 justify-center pt-2">
              <Button 
                variant="outline" 
                onClick={this.handleRetry}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              
              {isGameError && (
                <Button 
                  onClick={this.handleGoHome}
                  className="gap-2 bg-gradient-primary"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
