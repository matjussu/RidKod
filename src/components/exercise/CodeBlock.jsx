import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { customPythonTheme } from '../../utils/syntaxThemes';
import '../../styles/CodeBlock.css';

const CodeBlock = ({
  code = '',
  language,
  highlightedLines = [],
  isHighlightActive = false,
  isCompact = false,
  clickableLines = [],
  selectedLine = null,
  onLineClick = null,
  isSubmitted = false,
  correctAnswer = null,
  startLine = 1
}) => {
  // Protection : ne rien afficher si pas de code
  if (!code) return null;

  // Split code into lines for highlighting
  const lines = code.split('\n');

  return (
    <div className={`code-container ${isCompact ? 'compact' : ''}`}>
      <div className="code-wrapper">
        {lines.map((line, index) => {
          const lineNumber = index + startLine;
          const isHighlighted = isHighlightActive && highlightedLines.includes(lineNumber);
          const isClickable = clickableLines.includes(lineNumber);
          const isSelected = selectedLine === lineNumber;
          const isCorrectLine = isSubmitted && lineNumber === correctAnswer;
          const isIncorrectLine = isSubmitted && isSelected && lineNumber !== correctAnswer;

          return (
            <div
              key={index}
              className={`code-line ${isHighlighted ? 'highlighted' : ''} ${isClickable ? 'clickable' : ''} ${isSelected && !isSubmitted ? 'selected' : ''} ${isCorrectLine ? 'correct' : ''} ${isIncorrectLine ? 'incorrect' : ''}`}
              style={{
                animationDelay: isHighlighted ? `${highlightedLines.indexOf(lineNumber) * 0.3}s` : '0s'
              }}
              onClick={isClickable && onLineClick && !isSubmitted ? () => onLineClick(lineNumber) : undefined}
            >
              <span className="line-number">{lineNumber}</span>
              <SyntaxHighlighter
                language={language}
                style={customPythonTheme}
                customStyle={{
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '700',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  display: 'inline'
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace",
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: '1.6',
                    textAlign: 'left'
                  }
                }}
              >
                {line || ' '}
              </SyntaxHighlighter>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(CodeBlock);