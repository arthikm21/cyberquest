import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('ErrorBoundary', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="card max-w-lg text-center">
            <h2 className="text-2xl font-bold gradient-text mb-2">Something broke</h2>
            <p className="text-text-secondary mb-4">An unexpected error occurred. Your progress is safe in this browser.</p>
            <pre className="text-xs text-danger bg-bg/60 p-2 rounded overflow-auto max-h-32 text-left">{String(this.state.error.message)}</pre>
            <button className="btn-primary mt-4" onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
