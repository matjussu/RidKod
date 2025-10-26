import React from 'react';
import useHaptic from '../../hooks/useHaptic';

const CustomKeyboard = ({ type = 'numeric', onKeyPress, value = '', onSubmit }) => {
  const { triggerLight } = useHaptic();

  const handleKeyPress = (key) => {
    triggerLight();
    onKeyPress(key);
  };

  // Clavier numérique pour réponses chiffrées
  const numericKeys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '-']
  ];

  // Touches prédéfinies pour types Python
  const predefinedKeys = [
    ['str', 'int', 'float'],
    ['list', 'dict', 'tuple'],
    ['True', 'False', 'None'],
    ['set', 'bool', 'range']
  ];

  const keys = type === 'numeric' ? numericKeys : predefinedKeys;

  return (
    <div className="custom-keyboard">
      {/* Input Display */}
      <div className="keyboard-display">
        <div className="display-label">Ta réponse :</div>
        <div className="display-value">{value || '\u00A0'}</div>
      </div>

      {/* Keyboard Grid */}
      <div className="keyboard-grid">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className="keyboard-key"
                onClick={() => handleKeyPress(key)}
                type="button"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="keyboard-actions">
        <button
          className="keyboard-action keyboard-delete"
          onClick={() => handleKeyPress('⌫')}
          type="button"
        >
          ⌫ Effacer
        </button>
        <button
          className="keyboard-action keyboard-clear"
          onClick={() => handleKeyPress('CLEAR')}
          type="button"
        >
          Tout effacer
        </button>
      </div>

      <style>{`
        .custom-keyboard {
          width: 100%;
          padding: 16px;
          background: #1A1919;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        /* Display */
        .keyboard-display {
          background: #2C2C2E;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 16px;
          min-height: 60px;
        }

        .display-label {
          font-size: 12px;
          color: #8E8E93;
          margin-bottom: 8px;
          font-family: "JetBrains Mono", monospace;
          font-weight: 600;
        }

        .display-value {
          font-size: 24px;
          color: #FFFFFF;
          font-family: "JetBrains Mono", monospace;
          font-weight: 800;
          min-height: 32px;
          display: flex;
          align-items: center;
        }

        /* Keyboard Grid */
        .keyboard-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .keyboard-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        /* Keys */
        .keyboard-key {
          background: #2C2C2E;
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 16px 12px;
          font-size: 18px;
          font-weight: 800;
          font-family: "JetBrains Mono", monospace;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .keyboard-key:hover {
          background: #3A3A3C;
          border-color: #FF9500;
          transform: scale(1.02);
        }

        .keyboard-key:active {
          transform: scale(0.98);
          background: #FF9500;
          color: #000000;
        }

        /* Action Buttons */
        .keyboard-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .keyboard-action {
          background: #3A3A3C;
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          font-family: "JetBrains Mono", monospace;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .keyboard-delete:hover {
          background: #FF453A;
          border-color: #FF453A;
        }

        .keyboard-clear:hover {
          background: #FF9500;
          border-color: #FF9500;
          color: #000000;
        }

        .keyboard-action:active {
          transform: scale(0.98);
        }

        /* Responsive */
        @media (max-width: 375px) {
          .custom-keyboard {
            padding: 12px;
          }

          .keyboard-key {
            padding: 12px 8px;
            font-size: 16px;
            min-height: 50px;
          }

          .display-value {
            font-size: 20px;
          }

          .keyboard-action {
            font-size: 13px;
            padding: 12px;
          }
        }

        @media (max-width: 320px) {
          .keyboard-key {
            padding: 10px 6px;
            font-size: 14px;
            min-height: 46px;
          }

          .display-value {
            font-size: 18px;
          }

          .keyboard-row {
            gap: 8px;
          }

          .keyboard-grid {
            gap: 8px;
          }

          .keyboard-actions {
            gap: 8px;
          }
        }

        /* Animations */
        @keyframes keyPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        .keyboard-key:active,
        .keyboard-action:active {
          animation: keyPress 0.1s ease;
        }

        /* Dark mode enhancement */
        .keyboard-key,
        .keyboard-action {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .keyboard-key:hover,
        .keyboard-action:hover {
          box-shadow: 0 4px 12px rgba(255, 149, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

export default React.memo(CustomKeyboard);
