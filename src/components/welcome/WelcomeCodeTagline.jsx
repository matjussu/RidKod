import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customPythonTheme } from '../../utils/syntaxThemes';

/**
 * WelcomeCodeTagline Component
 * Affiche le tagline de bienvenue au format code Python (commentaires verts)
 *
 * Features:
 * - Syntax highlighting avec customPythonTheme
 * - Commentaires Python (#) en vert #6A9955
 * - Fade-in animation à 350ms (défini dans Welcome.css)
 * - Responsive : 360px → 320px → 280px
 */
const WelcomeCodeTagline = () => {
  const taglineCode = `# Mission: Apprends à lire du code comme un pro
# Sauvegarde ta progression et accède à ton profil partout`;

  return (
    <div className="code-tagline-container" role="region" aria-label="Mission statement in code format">
      <div className="code-tagline-block">
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
        >
          {taglineCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default React.memo(WelcomeCodeTagline);
