import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary Component
 * Capture les erreurs JavaScript dans l'arbre de composants enfants
 * et affiche une UI de fallback au lieu de faire crasher toute l'app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur pour debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    this.setState({ errorInfo });

    // TODO: Envoyer à un service de monitoring (Sentry, etc.)
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/home';
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personnalisée
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>⚠️</span>
            </div>

            <h1 style={styles.title}>Oups !</h1>
            <p style={styles.subtitle}>Une erreur inattendue s'est produite</p>

            <p style={styles.message}>
              Pas de panique, ça arrive parfois. Tu peux essayer de recharger la page
              ou retourner à l'accueil.
            </p>

            <div style={styles.buttons}>
              <button
                onClick={this.handleReload}
                style={styles.primaryButton}
              >
                🔄 Recharger la page
              </button>

              <button
                onClick={this.handleGoHome}
                style={styles.secondaryButton}
              >
                🏠 Retour à l'accueil
              </button>
            </div>

            {/* Afficher les détails en mode développement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Détails techniques</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Styles inline pour éviter les dépendances CSS
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1919',
    padding: '20px',
    fontFamily: '"JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace'
  },
  content: {
    maxWidth: '400px',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  iconContainer: {
    marginBottom: '24px'
  },
  icon: {
    fontSize: '64px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#FFFFFF'
  },
  subtitle: {
    fontSize: '16px',
    color: '#FF9500',
    margin: '0 0 24px 0',
    fontWeight: '600'
  },
  message: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#8E8E93',
    margin: '0 0 32px 0'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  primaryButton: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: '#30D158',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  secondaryButton: {
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'inherit',
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    border: '1px solid #3A3A3C',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  details: {
    marginTop: '32px',
    textAlign: 'left'
  },
  summary: {
    cursor: 'pointer',
    color: '#8E8E93',
    fontSize: '12px',
    marginBottom: '8px'
  },
  errorText: {
    backgroundColor: '#2C2C2E',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '11px',
    color: '#FF453A',
    overflow: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  }
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
