import React from 'react';
import PropTypes from 'prop-types';
import CodeBlock from '../exercise/CodeBlock';
import Mascot from '../common/Mascot';
import MascotAnalyse from '../common/MascotAnalyse';

/**
 * LessonSection - Composant pour rendre dynamiquement chaque section de leçon
 * Types supportés : text, code_example, highlight, exercise
 */
const LessonSection = ({
  section,
  exerciseComponent = null,
  isExerciseCompleted = false
}) => {
  // État pour la ligne de code sélectionnée (pour les annotations)
  const [selectedLine, setSelectedLine] = React.useState(null);

  // Rendu selon le type de section
  const renderSection = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="lesson-section lesson-section-with-mascot">
            {/* Bulle de dialogue */}
            <div className="lesson-speech-bubble">
              {section.title && (
                <h3 className="lesson-section-title">{section.title}</h3>
              )}
              <div className="lesson-section-content">
                {section.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="lesson-paragraph">
                    {formatText(paragraph)}
                  </p>
                ))}
              </div>
            </div>
            {/* Mascotte en bas à gauche */}
            <div className="lesson-mascot-container">
              <Mascot mood="neutral" size={100} color="#ffffffff" beakColor="#D26812" />
            </div>
          </div>
        );

      case 'code_example': {
        const hasExplanations = section.lineExplanations && Object.keys(section.lineExplanations).length > 0;
        // Lignes cliquables = celles qui ont une explication
        const clickableLines = hasExplanations
          ? Object.keys(section.lineExplanations).map(Number)
          : [];

        return (
          <div className="lesson-section lesson-section-code-interactive">
            {/* Titre optionnel */}
            {section.title && (
              <h3 className="lesson-code-title">{section.title}</h3>
            )}

            {/* Bloc de code avec CodeBlock existant */}
            <div className="lesson-code-container">
              <div className="lesson-code-block">
                <CodeBlock
                  code={section.code || ''}
                  language={section.language || 'python'}
                  clickableLines={clickableLines}
                  selectedLine={selectedLine}
                  onLineClick={(lineNumber) => {
                    setSelectedLine(selectedLine === lineNumber ? null : lineNumber);
                  }}
                />
              </div>

              {/* Hint pour cliquer - disparaît quand une ligne est sélectionnée */}
              {hasExplanations && !selectedLine && (
                <p className="lesson-code-hint">Clique sur une ligne pour avoir les explications</p>
              )}

              {/* Bulle d'explication avec mascotte */}
              {selectedLine && section.lineExplanations && section.lineExplanations[selectedLine] && (
                <div className="lesson-decoder-container">
                  <div className="lesson-decoder-bubble">
                    <button
                      className="lesson-decoder-close"
                      onClick={() => setSelectedLine(null)}
                      aria-label="Fermer"
                    >
                      ✕
                    </button>
                    <div className="lesson-decoder-content">
                      {formatText(section.lineExplanations[selectedLine])}
                    </div>
                  </div>
                  <div className="lesson-decoder-mascot">
                    <MascotAnalyse size={120} />
                  </div>
                </div>
              )}
            </div>

            {/* Caption optionnel */}
            {section.caption && (
              <p className="lesson-code-caption">{section.caption}</p>
            )}

            {/* Fallback: ancien système de tip si pas de lineExplanations */}
            {!hasExplanations && section.tip && (
              <div className="lesson-section-tip-inline">
                {section.tip.title && (
                  <h4 className="lesson-tip-title">{section.tip.title}</h4>
                )}
                <div className="lesson-tip-content">
                  {section.tip.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="lesson-tip-paragraph">
                      {formatText(paragraph)}
                    </p>
                  ))}
                </div>
                <div className="lesson-tip-mascot">
                  <Mascot mood="neutral" size={70} color="#F3ECEC" beakColor="#D26812" />
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'highlight':
        return (
          <div className={`lesson-section lesson-section-highlight lesson-highlight-${section.style || 'info'}`}>
            <div className="lesson-highlight-content">
              {formatText(section.content)}
            </div>
          </div>
        );

      case 'tip':
        return (
          <div className="lesson-section lesson-section-tip">
            {section.title && (
              <h4 className="lesson-tip-title">{section.title}</h4>
            )}
            <div className="lesson-tip-content">
              {section.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="lesson-tip-paragraph">
                  {formatText(paragraph)}
                </p>
              ))}
            </div>
          </div>
        );

      case 'exercise':
        return (
          <div className="lesson-section lesson-section-exercise">
            <div className="lesson-exercise-header">
              <h3 className="lesson-exercise-title">
                ✏️ Exercice pratique
              </h3>
              {isExerciseCompleted && (
                <span className="lesson-exercise-badge">
                  ✓ Complété
                </span>
              )}
            </div>
            {exerciseComponent}
          </div>
        );

      default:
        return null;
    }
  };

  // Formater le texte (gras, inline code, listes)
  const formatText = (text) => {
    const parts = [];
    let lastIndex = 0;
    let key = 0;

    // Regex pour détecter **bold**, `code`, et listes •
    const regex = /(\*\*.*?\*\*|`.*?`|^•\s.*$)/gm;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Texte avant le match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matched = match[0];

      // Bold **text**
      if (matched.startsWith('**') && matched.endsWith('**')) {
        const boldText = matched.slice(2, -2);
        parts.push(<strong key={key++} className="lesson-bold">{boldText}</strong>);
      }
      // Inline code `code`
      else if (matched.startsWith('`') && matched.endsWith('`')) {
        const codeText = matched.slice(1, -1);
        parts.push(<code key={key++} className="lesson-inline-code">{codeText}</code>);
      }
      // Liste • item
      else if (matched.startsWith('•')) {
        const listItem = matched.slice(2);
        parts.push(<li key={key++} className="lesson-list-item">{listItem}</li>);
      }

      lastIndex = regex.lastIndex;
    }

    // Reste du texte
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return renderSection();
};

LessonSection.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'code_example', 'highlight', 'tip', 'exercise']).isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    code: PropTypes.string,
    language: PropTypes.string,
    caption: PropTypes.string,
    style: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
    exerciseId: PropTypes.string
  }).isRequired,
  exerciseComponent: PropTypes.node,
  isExerciseCompleted: PropTypes.bool
};

// Styles inline pour éviter de créer un fichier CSS séparé
const styles = `
  /* Text Section */
  .lesson-section {
    margin-bottom: 24px;
  }

  /* Layout avec mascotte (bulle + canard en dessous) */
  .lesson-section-with-mascot {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* Bulle de dialogue */
  .lesson-speech-bubble {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
    width: 100%;
    position: relative;
    /* Variables personnalisables pour le triangle */
    --triangle-left: 100px;        /* Position horizontale du triangle */
    --triangle-size: 20px;        /* Taille du triangle */
  }

  /* Triangle de la bulle pointant vers le bas (vers la mascotte) */
  .lesson-speech-bubble::after {
    content: '';
    position: absolute;
    bottom: calc(-1 * var(--triangle-size));
    left: var(--triangle-left);
    width: 0;
    height: 0;
    border-left: var(--triangle-size) solid transparent;
    border-right: var(--triangle-size) solid transparent;
    border-top: calc(var(--triangle-size) + 2px) solid #FFFFFF;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.08));
  }

  /* Mascotte en bas à gauche */
  .lesson-mascot-container {
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
    margin-left: 12px;
  }

  /* Fallback pour section text sans mascotte (si besoin) */
  .lesson-section-text:not(.lesson-section-with-mascot) {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .lesson-section-title {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 18px;
    font-weight: 800;
    color: #000000;
    margin: 0 0 12px 0;
    line-height: 1.3;
  }

  .lesson-section-content {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 15px;
    font-weight: 500;
    color: #000000;
    line-height: 1.6;
  }

  .lesson-paragraph {
    margin: 0 0 12px 0;
  }

  .lesson-paragraph:last-child {
    margin-bottom: 0;
  }

  .lesson-bold {
    font-weight: 800;
    color: inherit; /* Hérite de la couleur du parent (blanc dans highlights, noir dans text) */
  }

  .lesson-inline-code {
    background: #F0F0F0;
    color: #1871BE;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 14px;
    font-weight: 700;
  }

  .lesson-list-item {
    margin-left: 20px;
    margin-bottom: 6px;
  }

  /* Code Section - Interactive */
  .lesson-section-code-interactive {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lesson-code-title {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 16px;
    font-weight: 800;
    color: #FFFFFF;
    margin: 0;
  }

  .lesson-code-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .lesson-code-block {
    background: #1A1919;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    padding: 8px 0;
  }

  .lesson-code-hint {
    font-family: "JetBrains Mono", monospace;
    font-size: 13px;
    font-weight: 500;
    color: #8E8E93;
    text-align: center;
    margin: 8px 0 0 0;
    padding: 0;
    font-style: italic;
  }

  /* Decoder bubble with mascot - Style Premium visible */
  .lesson-decoder-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    animation: fadeInUp 0.3s ease;
    margin-top: 4px;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .lesson-decoder-bubble {
    background: linear-gradient(135deg, #2C2C2E 0%, #1A1919 100%);
    border-radius: 16px;
    padding: 20px;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    width: 100%;
    position: relative;
    border: 1px solid rgba(255, 149, 0, 0.3);
  }

  .lesson-decoder-bubble::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 110px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid rgba(255, 149, 0, 1);
  }

  .lesson-decoder-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    font-size: 14px;
    color: #8E8E93;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .lesson-decoder-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
  }

  .lesson-decoder-content {
    font-family: "JetBrains Mono", monospace;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1.7;
    padding-right: 40px;
  }

  .lesson-decoder-content .lesson-inline-code {
    background: rgba(255, 149, 0, 0.2);
    color: #FF9500;
    border: 1px solid rgba(255, 149, 0, 0.3);
  }

  .lesson-decoder-mascot {
    margin-top: 10px;
    margin-left: 12px;
  }

  /* Tip section with mascot */
  .lesson-section-tip-inline {
    position: relative;
    padding-bottom: 60px;
  }

  .lesson-tip-mascot {
    position: absolute;
    bottom: -20px;
    left: 10px;
  }

  /* Old code section styles (fallback) */
  .lesson-section-code {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .lesson-code-wrapper {
    background: #000000;
    border-radius: 12px;
    padding: 16px;
    overflow-x: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .lesson-code-caption {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 13px;
    font-weight: 600;
    color: #8E8E93;
    margin: 0;
    text-align: center;
    font-style: italic;
  }

  /* Highlight Section */
  .lesson-section-highlight {
    border-radius: 12px;
    padding: 16px;
    border-left: 4px solid;
  }

  .lesson-highlight-info {
    background: rgba(24, 113, 190, 0.1);
    border-color: #1871BE;
  }

  .lesson-highlight-warning {
    background: rgba(255, 149, 0, 0.1);
    border-color: #FF9500;
  }

  .lesson-highlight-error {
    background: rgba(255, 56, 60, 0.1);
    border-color: #FF383C;
  }

  .lesson-highlight-success {
    background: rgba(8, 130, 1, 0.1);
    border-color: #088201;
  }

  .lesson-highlight-content {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1.6;
  }

  /* Tip Section (Décodeur) - Style Apple Premium */
  .lesson-section-tip,
  .lesson-section-tip-inline {
    background: rgba(255, 204, 0, 0.12);
    border-radius: 16px;
    padding: 20px;
    border-left: 5px solid #FFCC00;
    box-shadow: 0 4px 12px rgba(255, 204, 0, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .lesson-section-tip-inline {
    margin-top: 12px;
  }

  .lesson-tip-title {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 17px;
    font-weight: 900;
    color: #FFCC00;
    margin: 0 0 12px 0;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .lesson-tip-content {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 14px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1.7;
  }

  .lesson-tip-paragraph {
    margin: 0 0 12px 0;
  }

  .lesson-tip-paragraph:last-child {
    margin-bottom: 0;
  }

  .lesson-section-tip .lesson-inline-code {
    background: rgba(0, 0, 0, 0.3);
    color: #FFCC00;
    border: 1px solid rgba(255, 204, 0, 0.3);
  }

  /* Exercise Section */
  .lesson-section-exercise {
    background: #2C2C2E;
    border-radius: 16px;
    padding: 20px;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  .lesson-exercise-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .lesson-exercise-title {
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 16px;
    font-weight: 800;
    color: #FFFFFF;
    margin: 0;
  }

  .lesson-exercise-badge {
    background: #088201;
    color: #FFFFFF;
    font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
  }

  /* Responsive */
  @media (max-width: 375px) {
    .lesson-speech-bubble {
      padding: 16px;
      /* Variables personnalisables pour 375px */
      --triangle-left: 100px;
      --triangle-size: 20px;
    }

    .lesson-mascot-container {
      margin-top: 6px;
      margin-left: 8px;
    }

    .lesson-section-text:not(.lesson-section-with-mascot) {
      padding: 16px;
    }

    .lesson-section-title {
      font-size: 16px;
    }

    .lesson-section-content {
      font-size: 14px;
    }

    .lesson-code-wrapper {
      padding: 14px;
    }

    .lesson-section-highlight {
      padding: 14px;
    }

    .lesson-section-tip,
    .lesson-section-tip-inline {
      padding: 16px;
    }

    .lesson-tip-title {
      font-size: 15px;
    }

    .lesson-tip-content {
      font-size: 13px;
    }

    .lesson-section-exercise {
      padding: 16px;
    }
  }

  @media (max-width: 320px) {
    .lesson-speech-bubble {
      padding: 14px;
      /* Variables personnalisables pour 320px */
      --triangle-left: 100px;
      --triangle-size: 15px;
    }

    .lesson-mascot-container {
      margin-top: 4px;
      margin-left: 6px;
    }

    .lesson-section-text:not(.lesson-section-with-mascot) {
      padding: 14px;
    }

    .lesson-section-title {
      font-size: 15px;
    }

    .lesson-section-content {
      font-size: 13px;
    }

    .lesson-code-wrapper {
      padding: 12px;
    }

    .lesson-section-highlight {
      padding: 12px;
    }

    .lesson-section-tip,
    .lesson-section-tip-inline {
      padding: 14px;
    }

    .lesson-tip-title {
      font-size: 14px;
    }

    .lesson-tip-content {
      font-size: 12px;
    }

    .lesson-section-exercise {
      padding: 14px;
    }
  }
`;

// Injecter les styles (mise à jour automatique lors du hot-reload)
if (typeof document !== 'undefined') {
  let styleSheet = document.getElementById('lesson-section-styles');
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'lesson-section-styles';
    document.head.appendChild(styleSheet);
  }
  styleSheet.textContent = styles;
}

export default React.memo(LessonSection);
