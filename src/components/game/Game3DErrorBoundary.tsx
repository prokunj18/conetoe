import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class Game3DErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('3D rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-destructive/40 shadow-2xl bg-gradient-to-br from-red-950/20 to-background flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h3 className="text-xl font-bold">3D Rendering Error</h3>
            <p className="text-muted-foreground">
              Unable to initialize 3D graphics. Please try switching to 2D mode in Settings.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
