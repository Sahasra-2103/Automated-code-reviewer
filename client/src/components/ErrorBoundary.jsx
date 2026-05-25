import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message || 'Something went wrong.' };
  }

  componentDidCatch(error) {
    console.error('UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Application error</h2>
          <p>{this.state.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
