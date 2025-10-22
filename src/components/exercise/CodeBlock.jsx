import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeBlock = ({ code, language, highlightedLines = [], isHighlightActive = false, isCompact = false }) => {
  // Custom Python theme with exact color specifications
  const customPythonTheme = {
    'code[class*="language-"]': {
      color: '#FFFFFF',
      background: 'transparent',
      fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace",
      fontSize: '14px',
      fontWeight: '700',
      lineHeight: '1.6',
      direction: 'ltr',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      MozTabSize: '2',
      OTabSize: '2',
      tabSize: '2',
      WebkitHyphens: 'none',
      MozHyphens: 'none',
      msHyphens: 'none',
      hyphens: 'none'
    },
    'pre[class*="language-"]': {
      color: '#FFFFFF',
      background: 'transparent',
      fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace",
      fontSize: '14px',
      fontWeight: '700',
      lineHeight: '1.6',
      direction: 'ltr',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'normal',
      MozTabSize: '2',
      OTabSize: '2',
      tabSize: '2',
      WebkitHyphens: 'none',
      MozHyphens: 'none',
      msHyphens: 'none',
      hyphens: 'none',
      padding: '0',
      margin: '0',
      overflow: 'auto'
    },

    // Keywords (for, in, def, return, if, else, while, import, from, etc.)
    'keyword': {
      color: '#1871BE',
      fontWeight: '800'
    },
    'control': {
      color: '#1871BE',
      fontWeight: '800'
    },
    'conditional': {
      color: '#1871BE',
      fontWeight: '800'
    },
    'exception': {
      color: '#1871BE',
      fontWeight: '800'
    },
    'repeat': {
      color: '#1871BE',
      fontWeight: '800'
    },
    'include': {
      color: '#1871BE',
      fontWeight: '800'
    },
    'import': {
      color: '#1871BE',
      fontWeight: '800'
    },

    // Functions & Built-ins (int, input, float, range, print, len, str, etc.)
    'builtin': {
      color: '#D26812',
      fontWeight: '800'
    },
    'function': {
      color: '#D26812',
      fontWeight: '800'
    },
    'class-name': {
      color: '#D26812',
      fontWeight: '800'
    },
    'constant': {
      color: '#D26812',
      fontWeight: '800'
    },
    // Strings (tout entre quotes)
    'string': {
      color: '#088201',
      fontWeight: '700'
    },
    'char': {
      color: '#088201',
      fontWeight: '700'
    },
    'template-string': {
      color: '#088201',
      fontWeight: '700'
    },
    'string-interpolation': {
      color: '#088201',
      fontWeight: '700'
    },
    'triple-quoted-string': {
      color: '#088201',
      fontWeight: '700'
    },

    // Numbers
    'number': {
      color: '#B401A5',
      fontWeight: '700'
    },
    'float': {
      color: '#B401A5',
      fontWeight: '700'
    },
    'integer': {
      color: '#B401A5',
      fontWeight: '700'
    },

    // Variables et identifiers
    'variable': {
      color: '#9CDCFE',
      fontWeight: '700'
    },
    'parameter': {
      color: '#9CDCFE',
      fontWeight: '700'
    },
    'property': {
      color: '#9CDCFE',
      fontWeight: '700'
    },
    'attr-name': {
      color: '#9CDCFE',
      fontWeight: '700'
    },
    'identifier': {
      color: '#9CDCFE',
      fontWeight: '700'
    },

    // Operators
    'operator': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'assignment': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'arithmetic': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'comparison': {
      color: '#D4D4D4',
      fontWeight: '700'
    },

    // Punctuation
    'punctuation': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'delimiter': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'bracket': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'brace': {
      color: '#D4D4D4',
      fontWeight: '700'
    },
    'parenthesis': {
      color: '#D4D4D4',
      fontWeight: '700'
    },

    // Comments
    'comment': {
      color: '#6A9955',
      fontStyle: 'italic'
    },
    'prolog': {
      color: '#6A9955',
      fontStyle: 'italic'
    },
    'doctype': {
      color: '#6A9955',
      fontStyle: 'italic'
    },
    'cdata': {
      color: '#6A9955',
      fontStyle: 'italic'
    },

    // F-strings special handling
    'f-string': {
      color: '#CE9178'
    },
    'f-string-formatting': {
      color: '#9CDCFE'
    },
    'interpolation': {
      color: '#9CDCFE'
    },
    'interpolation-punctuation': {
      color: '#569CD6'
    },

    // Boolean values
    'boolean': {
      color: '#569CD6'
    },

    // None/null
    'null': {
      color: '#569CD6'
    },

    // Other elements
    'tag': {
      color: '#569CD6'
    },
    'attr-value': {
      color: '#CE9178'
    },
    'entity': {
      color: '#DCDCAA'
    },
    'url': {
      color: '#DCDCAA'
    },
    'symbol': {
      color: '#DCDCAA'
    },
    'important': {
      color: '#FF6B6B',
      fontWeight: '800'
    },
    'bold': {
      fontWeight: '800'
    },
    'italic': {
      fontStyle: 'italic'
    },
    'namespace': {
      opacity: 0.7
    }
  };

  // Split code into lines for highlighting
  const lines = code.split('\n');

  return (
    <div className={`code-container ${isCompact ? 'compact' : ''}`}>
      <div className="code-wrapper">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = isHighlightActive && highlightedLines.includes(lineNumber);

          return (
            <div
              key={index}
              className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
              style={{
                animationDelay: isHighlighted ? `${highlightedLines.indexOf(lineNumber) * 0.3}s` : '0s'
              }}
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

      <style>{`
        .code-wrapper {
          position: relative;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
        }

        .code-line {
          padding: 2px 8px 2px 40px;
          margin: 0;
          border-radius: 4px;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          min-height: 24px;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .line-number {
          position: absolute;
          left: 8px;
          color: #6A9955;
          font-size: 12px;
          font-weight: 500;
          width: 24px;
          text-align: right;
          user-select: none;
          font-family: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
        }

        .code-line.highlighted {
          background: rgba(48, 209, 88, 0.15);
          box-shadow:
            0 0 0 2px rgba(48, 209, 88, 0.3),
            0 0 8px 0 rgba(48, 209, 88, 0.2);
          animation: highlightPulse 0.6s ease-out;
          position: relative;
        }

        .code-line.highlighted::before {
          content: '▸';
          position: absolute;
          left: -12px;
          color: #30D158;
          font-size: 16px;
          animation: arrowSlide 0.4s ease-out;
          z-index: 1;
        }

        .code-line.highlighted::after {
          content: '';
          position: absolute;
          left: -4px;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom,
            transparent,
            #30D158,
            transparent
          );
          animation: lineGlow 1s ease-in-out infinite;
          border-radius: 2px;
        }

        @keyframes highlightPulse {
          0% {
            background: rgba(48, 209, 88, 0);
            box-shadow: 0 0 0 0 rgba(48, 209, 88, 0);
          }
          50% {
            background: rgba(48, 209, 88, 0.25);
            box-shadow:
              0 0 0 3px rgba(48, 209, 88, 0.5),
              0 0 12px 0 rgba(48, 209, 88, 0.3);
          }
          100% {
            background: rgba(48, 209, 88, 0.15);
            box-shadow:
              0 0 0 2px rgba(48, 209, 88, 0.3),
              0 0 8px 0 rgba(48, 209, 88, 0.2);
          }
        }

        @keyframes arrowSlide {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes lineGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* Animation séquentielle pour plusieurs lignes */
        .code-line.highlighted:nth-child(1) {
          animation-delay: 0s;
        }
        .code-line.highlighted:nth-child(2) {
          animation-delay: 0.3s;
        }
        .code-line.highlighted:nth-child(3) {
          animation-delay: 0.6s;
        }
        .code-line.highlighted:nth-child(4) {
          animation-delay: 0.9s;
        }
        .code-line.highlighted:nth-child(5) {
          animation-delay: 1.2s;
        }

        /* iPhone SE, iPhone 12/13 mini */
        @media (max-width: 375px) {
          .code-line {
            padding: 2px 6px 2px 36px;
            min-height: 22px;
          }

          .line-number {
            left: 6px;
            font-size: 11px;
            width: 20px;
          }

          .code-line.highlighted::before {
            left: -10px;
            font-size: 14px;
          }
        }

        /* iPhone SE 1ère génération */
        @media (max-width: 320px) {
          .code-line {
            padding: 1px 4px 1px 32px;
            min-height: 20px;
          }

          .line-number {
            left: 4px;
            font-size: 10px;
            width: 18px;
          }

          .code-line.highlighted::before {
            left: -8px;
            font-size: 12px;
          }

          .code-line.highlighted::after {
            width: 3px;
          }
        }

        /* Mode paysage */
        @media (orientation: landscape) {
          .code-line {
            padding: 1px 6px 1px 34px;
            min-height: 20px;
          }

          .line-number {
            font-size: 11px;
          }

          .code-line.highlighted::before {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;