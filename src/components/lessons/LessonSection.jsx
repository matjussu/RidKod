import React from 'react';
import PropTypes from 'prop-types';
import CodeBlock from '../exercise/CodeBlock';

/**
 * LessonSection - Composant pour rendre dynamiquement chaque section de leçon
 * Types supportés : text, code_example, highlight, exercise
 */
const LessonSection = ({
  section,
  exerciseComponent = null,
  isExerciseCompleted = false
}) => {
  // Rendu selon le type de section
  const renderSection = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="lesson-section lesson-section-text">
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
        );

      case 'code_example':
        return (
          <div className="lesson-section lesson-section-code">
            <div className="lesson-code-wrapper">
              <CodeBlock
                code={section.code}
                language={section.language || 'python'}
                isCompact={false}
              />
            </div>
            {section.caption && (
              <p className="lesson-code-caption">{section.caption}</p>
            )}
          </div>
        );

      case 'highlight':
        return (
          <div className={`lesson-section lesson-section-highlight lesson-highlight-${section.style || 'info'}`}>
            <div className="lesson-highlight-content">
              {formatText(section.content)}
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
    type: PropTypes.oneOf(['text', 'code_example', 'highlight', 'exercise']).isRequired,
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

  .lesson-section-text {
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
    color: #000000;
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

  /* Code Section */
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
    .lesson-section-text {
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

    .lesson-section-exercise {
      padding: 16px;
    }
  }

  @media (max-width: 320px) {
    .lesson-section-text {
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

    .lesson-section-exercise {
      padding: 14px;
    }
  }
`;

// Injecter les styles
if (typeof document !== 'undefined' && !document.getElementById('lesson-section-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'lesson-section-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default React.memo(LessonSection);
