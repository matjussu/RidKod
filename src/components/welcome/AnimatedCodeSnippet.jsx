import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customPythonTheme } from '../../utils/syntaxThemes';

/**
 * AnimatedCodeSnippet Component
 * Message de bienvenue créatif en code Python avec animation
 *
 * Timeline (lecture unique - pas de loop):
 * - 0-1s : Lignes 1-4 apparaissent (fonction bienvenue)
 * - 1-2s : Lignes 5-7 apparaissent + ligne 6 highlight vert (appel fonction)
 * - 2-3s : Ligne 8 apparaît + highlight orange (affichage)
 * - 3s+ : Reste statique
 *
 * Features:
 * - Syntax highlighting Python complet
 * - Highlights vert/orange pour montrer execution flow
 * - Respect prefers-reduced-motion (affiche final state directement)
 * - React.memo pour performance
 * - GPU optimization (will-change dans CSS)
 */
const AnimatedCodeSnippet = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation stage (0 = blank, 1-3 = progressive reveal, 3 = final)
  const [stage, setStage] = useState(prefersReducedMotion ? 3 : 0);

  // Code example - Welcome message (creative & beginner-friendly)
  const codeLines = [
    'def bienvenue_sur(app):',
    '    mission = "Apprendre à lire le code"',
    '    skills = ["Lire", "Comprendre", "Maîtriser"]',
    '    return f"Bienvenue sur {app} !"',
    '',
    'message = bienvenue_sur("ReadCod")',
    'print(message)  # Bienvenue sur ReadCod !',
    ''
  ];

  const fullCode = codeLines.join('\n');

  useEffect(() => {
    // Skip animation if reduced motion preferred
    if (prefersReducedMotion) {
      return;
    }

    // Animation timeline (single play)
    const timer1 = setTimeout(() => setStage(1), 500);   // Lines 1-4 at 0.5s
    const timer2 = setTimeout(() => setStage(2), 1500);  // Lines 5-7 at 1.5s
    const timer3 = setTimeout(() => setStage(3), 2500);  // Line 8 at 2.5s

    // Cleanup timers on unmount
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []); // Run only once on mount

  // Custom line renderer with highlight support
  const renderLine = (lineNumber, lineContent) => {
    // Line 6 (result = calculate_average...) - Green highlight in stage 2+
    const isHighlightGreen = lineNumber === 6 && stage >= 2;

    // Line 8 (print...) - Orange highlight in stage 3
    const isHighlightOrange = lineNumber === 8 && stage >= 3;

    const lineClasses = [
      'code-snippet-line',
      isHighlightGreen ? 'highlight-green' : '',
      isHighlightOrange ? 'highlight-orange' : ''
    ].filter(Boolean).join(' ');

    return (
      <div key={lineNumber} className={lineClasses}>
        {lineContent}
      </div>
    );
  };

  return (
    <div
      className={`code-snippet-container snippet-stage-${stage}`}
      role="region"
      aria-label="Python code demonstration"
      aria-live="polite"
    >
      <div className="code-snippet-block">
        <SyntaxHighlighter
          language="python"
          style={customPythonTheme}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            overflow: 'visible'
          }}
          codeTagProps={{
            style: {
              fontFamily: "'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace",
              fontSize: '14px',
              lineHeight: '1.6',
              fontWeight: '700'
            }
          }}
          wrapLines={true}
          lineProps={(lineNumber) => {
            // Apply highlighting classes based on line number and stage
            const isHighlightGreen = lineNumber === 6 && stage >= 2;
            const isHighlightOrange = lineNumber === 8 && stage >= 3;

            return {
              className: [
                'code-snippet-line',
                isHighlightGreen ? 'highlight-green' : '',
                isHighlightOrange ? 'highlight-orange' : ''
              ].filter(Boolean).join(' ')
            };
          }}
        >
          {fullCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default React.memo(AnimatedCodeSnippet);
