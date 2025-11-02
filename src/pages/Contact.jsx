import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useHaptic from '../hooks/useHaptic';
import '../styles/Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const { triggerSuccess, triggerError, triggerLight } = useHaptic();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('question');
  const [message, setMessage] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [outputLines, setOutputLines] = useState([]);

  const handleBack = () => {
    triggerLight();
    navigate('/home');
  };

  const handleCommandClick = (command) => {
    triggerLight();

    if (command === 'github') {
      window.open('https://github.com', '_blank');
    } else if (command === 'twitter') {
      window.open('https://twitter.com', '_blank');
    } else if (command === 'discord') {
      // Coming soon - Discord link not ready yet
      return;
    }
  };

  const validateForm = () => {
    if (!name || name.length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide');
      return false;
    }
    if (!message || message.length < 10) {
      setError('Le message doit contenir au moins 10 caractères');
      return false;
    }
    if (message.length > 500) {
      setError('Le message ne peut pas dépasser 500 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      triggerError();
      return;
    }

    setIsSubmitting(true);
    triggerLight();

    // Simulate compilation delay for effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // FormSubmit.co endpoint - REMPLACER PAR TON EMAIL
      const response = await fetch('https://formsubmit.co/ajax/YOUR_EMAIL@example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          type,
          message,
          _subject: `Nouveau message ReadCod - ${type}`,
          _template: 'box'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setShowOutput(true);
        triggerSuccess();

        // Typewriter effect for output
        const lines = [
          '✓ Message sent successfully!',
          '→ Response time: ~24h',
          '→ Status: 200 OK',
          '→ return true;'
        ];

        for (let i = 0; i < lines.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setOutputLines(prev => [...prev, lines[i]]);
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setName('');
          setEmail('');
          setMessage('');
          setType('question');
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi. Réessaye plus tard.');
      triggerError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Back Button - Red X */}
      <button className="contact-back-button" onClick={handleBack} aria-label="Retour">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Header */}
      <div className="contact-header">
        <p className="contact-subtitle">
          <span className="contact-cursor">_</span> Envoie-nous ton message...
        </p>
      </div>

      {/* Terminal Form */}
      {!isSuccess && (
      <form className="contact-terminal" onSubmit={handleSubmit}>
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span className="terminal-command">contact.send(&#123;</span>
        </div>

        {/* Name Input */}
        <div className="terminal-line terminal-input-line">
          <span className="terminal-indent">  </span>
          <span className="terminal-key">name:</span>
          <span className="terminal-string">"</span>
          <input
            type="text"
            className="terminal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Ton nom"
            disabled={isSubmitting}
          />
          <span className="terminal-string">"</span>
          {focusedField === 'name' && <span className="terminal-cursor-blink">|</span>}
          <span className="terminal-comma">,</span>
        </div>

        {/* Email Input */}
        <div className="terminal-line terminal-input-line">
          <span className="terminal-indent">  </span>
          <span className="terminal-key">email:</span>
          <span className="terminal-string">"</span>
          <input
            type="email"
            className="terminal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="ton.email@exemple.com"
            disabled={isSubmitting}
          />
          <span className="terminal-string">"</span>
          {focusedField === 'email' && <span className="terminal-cursor-blink">|</span>}
          <span className="terminal-comma">,</span>
        </div>

        {/* Type Select */}
        <div className="terminal-line terminal-input-line">
          <span className="terminal-indent">  </span>
          <span className="terminal-key">type:</span>
          <span className="terminal-string">"</span>
          <select
            className="terminal-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              triggerLight();
            }}
            onFocus={() => setFocusedField('type')}
            onBlur={() => setFocusedField(null)}
            disabled={isSubmitting}
          >
            <option value="question">question</option>
            <option value="bug">bug</option>
            <option value="feedback">feedback</option>
          </select>
          <span className="terminal-string">"</span>
          {focusedField === 'type' && <span className="terminal-cursor-blink">|</span>}
          <span className="terminal-comma">,</span>
        </div>

        {/* Message Textarea */}
        <div className="terminal-line terminal-input-line terminal-textarea-line">
          <span className="terminal-indent">  </span>
          <span className="terminal-key">message:</span>
          <span className="terminal-string">"</span>
          <textarea
            className="terminal-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            placeholder="Décris ton problème ou ton idée..."
            rows={3}
            disabled={isSubmitting}
          />
          <span className="terminal-string">"</span>
          {focusedField === 'message' && <span className="terminal-cursor-blink">|</span>}
        </div>

        <div className="terminal-line">
          <span className="terminal-command">&#125;);</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="terminal-error">
            <span className="terminal-error-icon">✗</span> {error}
          </div>
        )}

        {/* Execute Button */}
        <button
          type="submit"
          className="contact-execute-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="execute-spinner"></span>
              Compiling...
            </>
          ) : (
            <>
              <span className="execute-icon">&gt;</span> Execute contact.send()
            </>
          )}
        </button>
      </form>
      )}

      {/* Output Section */}
      {showOutput && (
        <div className="contact-output">
          <div className="output-header">
            <span className="output-title">// Output</span>
          </div>
          <div className="output-content">
            {outputLines.map((line, index) => (
              <div key={index} className="output-line">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Command Cards */}
      <div className="contact-commands">
        <div className="commands-title">
          <span className="commands-comment">// Alternative commands:</span>
        </div>
        <div className="commands-grid">
          <button
            className="command-card"
            onClick={() => handleCommandClick('github')}
          >
            <span className="command-text">$ open github</span>
            <svg className="command-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </button>

          <button
            className="command-card"
            onClick={() => handleCommandClick('twitter')}
          >
            <span className="command-text">$ follow twitter</span>
            <svg className="command-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
            </svg>
          </button>

          <button
            className="command-card command-card-disabled"
            disabled
          >
            <span className="command-text">$ join discord</span>
            <span className="command-badge">Soon</span>
            <svg className="command-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
