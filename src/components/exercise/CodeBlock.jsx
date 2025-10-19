import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeBlock = ({ code, language }) => {
  // Custom Python theme with exact color specifications
  const customPythonTheme = {
    'code[class*="language-"]': {
      color: '#D4D4D4',
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
      color: '#D4D4D4',
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

  return (
    <div className="code-container">
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
          textAlign: 'left'
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
        {code}
      </SyntaxHighlighter>

      <style>{`
        /* Code Block */
        .code-container {
          background: #030303ff;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          overflow-x: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Hauteur adaptative définie dans App.jsx */
        }

        .code-container pre {
          margin: 0 !important;
          background: transparent !important;
          padding: 0 !important;
          font-size: 14px !important;
          font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace !important;
          font-weight: 700 !important;
          line-height: 1.6 !important;
          text-align: left !important;
          width: 100%;
        }

        .code-container code {
          font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          line-height: 1.6 !important;
          text-align: left !important;
        }

        /* Responsive - hauteurs gérées par App.jsx */
        @media (max-width: 375px) {
          .code-container pre {
            font-size: 13px !important;
          }
          .code-container code {
            font-size: 13px !important;
          }
        }

        @media (max-width: 320px) {
          .code-container pre {
            font-size: 12px !important;
          }
          .code-container code {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;
