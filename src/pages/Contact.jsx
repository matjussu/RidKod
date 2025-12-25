import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useHaptic from '../hooks/useHaptic';
import '../styles/Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const isInitialized = useRef(false);
  const cursorRef = useRef(null);

  // Terminal state - Progressive questions
  const [step, setStep] = useState(0); // 0: welcome, 1: name, 2: email, 3: message, 4: confirm, 5: sending, 6: success
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  // Questions configuration
  const questions = [
    {
      step: 0,
      prompt: 'readcod@terminal:~$',
      text: 'Bienvenue dans le terminal de contact ReadCod',
      action: () => {
        setTimeout(() => addLine('Tapez "start" pour commencer...'), 500);
      }
    },
    {
      step: 1,
      prompt: 'readcod@terminal:~$',
      text: 'Votre nom ?',
      placeholder: 'Votre nom',
      validator: (value) => {
        if (!value || value.length < 2) return 'Le nom doit contenir au moins 2 caractères';
        return null;
      }
    },
    {
      step: 2,
      prompt: 'readcod@terminal:~$',
      text: 'Votre adresse email ?',
      placeholder: 'ton.email@exemple.com',
      validator: (value) => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide';
        return null;
      }
    },
    {
      step: 3,
      prompt: 'readcod@terminal:~$',
      text: 'Ton message ? (Tape "END" sur une nouvelle ligne pour terminer)',
      placeholder: 'Décris ton problème ou ton idée...',
      multiline: true,
      validator: (value) => {
        if (!value || value.length < 10) return 'Le message doit contenir au moins 10 caractères';
        if (value.length > 500) return 'Le message ne peut pas dépasser 500 caractères';
        return null;
      }
    }
  ];

  // Add line to terminal
  const addLine = (text, type = 'output') => {
    setTerminalLines(prev => [...prev, { text, type, timestamp: Date.now() }]);
  };

  // No auto-scroll - let user control their scroll position

  // Focus input when step changes
  useEffect(() => {
    if (step > 0 && step <= 4) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  // Initialize terminal
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      addLine('Bienvenue dans le terminal de contact ReadCod', 'output');
      addLine('ReadCod Contact Terminal v1.0.0', 'system');
      addLine('═══════════════════════════════════════', 'system');
      addLine('Tapez "start" pour commencer...', 'output');
    }
  }, []);

  // Update cursor position based on input text width
  useEffect(() => {
    if (inputRef.current && cursorRef.current && !questions[step]?.multiline) {
      // Create a temporary span to measure text width
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '14px "JetBrains Mono", "Courier New", monospace';
      const textWidth = context.measureText(currentInput).width;
      setCursorPosition(textWidth);
    }
  }, [currentInput, step]);

  // macOS button handlers
  const handleCloseButton = () => {
    triggerLight();
    navigate('/home');
  };

  const handleMinimizeButton = () => {
    // Decorative only - no action
  };

  const handleMaximizeButton = () => {
    // Decorative only - no action
  };

  const handleCommandClick = (command) => {
    triggerLight();
    if (command === 'github') {
      window.open('https://github.com', '_blank');
    } else if (command === 'twitter') {
      window.open('https://twitter.com', '_blank');
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;

    if (questions[step]?.multiline) {
      // Multiline mode - check for END command
      const lines = value.split('\n');
      const lastLine = lines[lines.length - 1];
      if (lastLine.trim() === 'END') {
        // Remove END and process
        const message = lines.slice(0, -1).join('\n').trim();
        setCurrentInput(message);
        handleSubmitInput(message);
        return;
      }
    }

    // Auto-submit "start" at step 0
    if (step === 0 && value.toLowerCase() === 'start') {
      setCurrentInput(value);
      setTimeout(() => handleSubmitInput(value), 100);
      return;
    }

    setCurrentInput(value);
  };

  const handleKeyDown = (e) => {
    // Enter to submit (except for multiline)
    if (e.key === 'Enter' && !questions[step]?.multiline) {
      e.preventDefault();
      handleSubmitInput(currentInput);
    }
  };

  const handleSubmitInput = (value = currentInput) => {
    setError('');

    // Step 0: Start command
    if (step === 0) {
      if (value.toLowerCase() !== 'start') {
        addLine(`$ ${value}`, 'input');
        addLine('Commande invalide. Tape "start" pour commencer.', 'error');
        setCurrentInput('');
        return;
      }
      addLine('$ start', 'input');
      addLine('Initialisation du formulaire de contact...', 'success');
      triggerLight();
      setTimeout(() => {
        setStep(1);
        addLine('', 'separator');
        addLine(questions[1].text, 'question');
      }, 800);
      setCurrentInput('');
      return;
    }

    // Steps 1-3: Questions
    if (step >= 1 && step <= 3) {
      const question = questions[step];
      const validationError = question.validator(value);

      if (validationError) {
        setError(validationError);
        triggerError();
        return;
      }

      // Save answer
      const fields = ['', 'name', 'email', 'message'];
      const field = fields[step];

      addLine(`> ${value}`, 'input');
      setFormData(prev => ({ ...prev, [field]: value }));
      triggerLight();

      // Move to next step
      if (step === 3) {
        // Last question - show confirmation
        setTimeout(() => {
          setStep(4);
          showConfirmation({ ...formData, message: value });
        }, 500);
      } else {
        setTimeout(() => {
          setStep(step + 1);
          addLine('', 'separator');
          addLine(questions[step + 1].text, 'question');
        }, 500);
      }

      setCurrentInput('');
      return;
    }

    // Step 4: Confirmation
    if (step === 4) {
      if (value.toLowerCase() === 'y' || value.toLowerCase() === 'yes') {
        addLine('$ yes', 'input');
        triggerSuccess();
        handleSendMessage();
      } else if (value.toLowerCase() === 'n' || value.toLowerCase() === 'no') {
        addLine('$ no', 'input');
        addLine('Formulaire annulé. Tape "start" pour recommencer.', 'error');
        triggerError();
        resetForm();
      } else {
        addLine(`$ ${value}`, 'input');
        addLine('Réponse invalide. Tape "y" (oui) ou "n" (non)', 'error');
        triggerError();
      }
      setCurrentInput('');
    }
  };

  const showConfirmation = (data) => {
    addLine('', 'separator');
    addLine('═══════════════════════════════════════', 'system');
    addLine('Résumé du message:', 'system');
    addLine(`  Nom: ${data.name}`, 'output');
    addLine(`  Email: ${data.email}`, 'output');
    addLine(`  Message: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`, 'output');
    addLine('═══════════════════════════════════════', 'system');
    addLine('', 'separator');
    addLine('Envoyer ce message ? (y/n)', 'question');
  };

  const handleSendMessage = async () => {
    setStep(5);
    setIsSubmitting(true);
    addLine('', 'separator');
    addLine('Envoi du message en cours...', 'system');

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // FormSubmit.co endpoint
      const response = await fetch(`https://formsubmit.co/ajax/${import.meta.env.VITE_CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Nouveau message ReadCod`,
          _template: 'box'
        })
      });

      if (response.ok) {
        setStep(6);
        triggerSuccess();

        // Success output with typewriter effect
        const successLines = [
          '',
          '✓ Message envoyé avec succès !',
          '',
          `→ De: ${formData.name} <${formData.email}>`,
          `→ Status: 200 OK`,
          `→ Délai de réponse: ~24h`,
          '',
          '═══════════════════════════════════════',
          '',
          'Merci pour ton message !',
          'Tu peux fermer cette fenêtre ou envoyer un autre message.',
          '',
          'Tape "start" pour envoyer un nouveau message...'
        ];

        for (let i = 0; i < successLines.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 150));
          if (successLines[i]) {
            addLine(successLines[i], i === 1 ? 'success' : 'output');
          } else {
            addLine('', 'separator');
          }
        }

        // Reset form after success
        setTimeout(() => {
          resetForm();
        }, 3000);

      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      addLine('', 'separator');
      addLine('✗ Erreur lors de l\'envoi du message', 'error');
      addLine('Vérifie ta connexion internet et réessaye.', 'error');
      addLine('', 'separator');
      addLine('Tape "start" pour réessayer...', 'output');
      triggerError();
      setStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', message: '' });
    setStep(0);
    setCurrentInput('');
    setError('');
  };

  return (
    <div className="contact-container">
      {/* Terminal Window */}
      <div className="terminal-window">
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-buttons">
            <button
              className="terminal-button terminal-button-close"
              onClick={handleCloseButton}
              aria-label="Fermer"
            />
            <button
              className="terminal-button terminal-button-minimize"
              onClick={handleMinimizeButton}
              aria-label="Réduire"
            />
            <button
              className="terminal-button terminal-button-maximize"
              onClick={handleMaximizeButton}
              aria-label="Agrandir"
            />
          </div>
          <div className="terminal-title">contact@readcod.app</div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          {/* Terminal Output */}
          <div className="terminal-output">
            {terminalLines.map((line, index) => (
              <div key={index} className={`terminal-line terminal-line-${line.type}`}>
                {line.type === 'input' && <span className="terminal-prompt">$</span>}
                {line.type === 'question' && <span className="terminal-prompt">?</span>}
                {line.text}
              </div>
            ))}

            {/* Current Input Line */}
            {step >= 0 && step <= 4 && !isSubmitting && (
              <div className="terminal-line terminal-line-active">
                <span className="terminal-prompt">$</span>
                {questions[step]?.multiline ? (
                  <textarea
                    ref={inputRef}
                    className="terminal-textarea"
                    value={currentInput}
                    onChange={handleInput}
                    placeholder={questions[step]?.placeholder}
                    rows={4}
                    disabled={isSubmitting}
                  />
                ) : (
                  <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                    <input
                      ref={inputRef}
                      type="text"
                      className="terminal-input"
                      value={currentInput}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      placeholder={questions[step]?.placeholder}
                      disabled={isSubmitting}
                      autoComplete="off"
                    />
                    <span
                      ref={cursorRef}
                      className="terminal-cursor"
                      style={{
                        position: 'absolute',
                        left: `${cursorPosition}px`,
                        pointerEvents: 'none'
                      }}
                    >
                      _
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="terminal-line terminal-line-error">
                <span className="terminal-prompt">!</span>
                {error}
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>

      {/* Command Cards */}
      <div className="contact-commands">
        <div className="commands-title">Autres moyens de contact :</div>
        <div className="commands-grid">
          <button className="command-card" onClick={() => handleCommandClick('github')}>
            <svg className="command-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </button>

          <button className="command-card" onClick={() => handleCommandClick('twitter')}>
            <svg className="command-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span>Twitter</span>
          </button>

          <button className="command-card command-card-disabled" disabled>
            <svg className="command-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
            <span className="command-badge">Bientôt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
