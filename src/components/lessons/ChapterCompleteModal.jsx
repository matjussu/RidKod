import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChapterCompleteModal = ({ chapterTitle, xpEarned, onClose }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate(-1); // Retour à la liste des chapitres
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Icône de succès */}
        <div style={styles.iconContainer}>
          <div style={styles.checkmark}>✓</div>
        </div>

        {/* Titre */}
        <h2 style={styles.title}>Chapitre terminé !</h2>

        {/* Nom du chapitre */}
        <p style={styles.chapterTitle}>{chapterTitle}</p>

        {/* XP gagnée */}
        <div style={styles.xpContainer}>
          <span style={styles.xpLabel}>XP gagnée</span>
          <span style={styles.xpValue}>+{xpEarned}</span>
        </div>

        {/* Message encourageant */}
        <p style={styles.message}>
          Excellent travail ! Continue comme ça pour maîtriser Python.
        </p>

        {/* Bouton de fermeture */}
        <button style={styles.button} onClick={handleContinue}>
          Continuer
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px 24px',
    maxWidth: '340px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#088201',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 0.6s ease-out',
  },
  checkmark: {
    fontSize: '48px',
    color: '#FFFFFF',
    fontWeight: '800',
    fontFamily: '"JetBrains Mono", monospace',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#000000',
    margin: '0 0 12px 0',
    fontFamily: '"JetBrains Mono", monospace',
  },
  chapterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#8E8E93',
    margin: '0 0 24px 0',
    fontFamily: '"JetBrains Mono", monospace',
  },
  xpContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: '12px',
    padding: '16px',
    margin: '0 0 20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#000000',
    fontFamily: '"JetBrains Mono", monospace',
  },
  xpValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#088201',
    fontFamily: '"JetBrains Mono", monospace',
  },
  message: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#8E8E93',
    margin: '0 0 24px 0',
    fontFamily: '"JetBrains Mono", monospace',
  },
  button: {
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#088201',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '800',
    border: 'none',
    cursor: 'pointer',
    fontFamily: '"JetBrains Mono", monospace',
    transition: 'all 0.2s ease',
  },
};

// Ajout des animations CSS via un style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  if (!document.head.querySelector('[data-component="chapter-complete-modal"]')) {
    styleSheet.setAttribute('data-component', 'chapter-complete-modal');
    document.head.appendChild(styleSheet);
  }
}

export default ChapterCompleteModal;
