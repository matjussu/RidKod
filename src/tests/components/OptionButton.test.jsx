import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OptionButton from '../../components/exercise/OptionButton';

describe('OptionButton', () => {
  describe('Rendering', () => {
    it('devrait afficher la valeur de l\'option', () => {
      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('devrait accepter les nombres comme valeur', () => {
      render(
        <OptionButton
          value={42}
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  describe('État avant validation (isSubmitted = false)', () => {
    it('devrait avoir la classe "default" quand non sélectionné', () => {
      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('default');
      expect(button.className).not.toContain('selected');
    });

    it('devrait avoir la classe "selected" quand sélectionné', () => {
      render(
        <OptionButton
          value="Option A"
          isSelected={true}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('selected');
      expect(button.className).not.toContain('default');
    });

    it('ne devrait PAS être disabled avant validation', () => {
      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('État après validation (isSubmitted = true)', () => {
    it('devrait avoir la classe "correct" si c\'est la bonne réponse', () => {
      render(
        <OptionButton
          value="Bonne réponse"
          isSelected={false}
          isCorrect={true}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('correct');
    });

    it('devrait avoir la classe "incorrect" si sélectionné mais incorrect', () => {
      render(
        <OptionButton
          value="Mauvaise réponse"
          isSelected={true}
          isCorrect={false}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('incorrect');
    });

    it('devrait avoir la classe "faded" si ni sélectionné ni correct', () => {
      render(
        <OptionButton
          value="Autre option"
          isSelected={false}
          isCorrect={false}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('faded');
      expect(button.className).toContain('disabled');
    });

    it('devrait être disabled après validation', () => {
      render(
        <OptionButton
          value="Option"
          isSelected={false}
          isCorrect={false}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('devrait appeler onClick quand cliqué avant validation', () => {
      const handleClick = vi.fn();

      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('ne devrait PAS appeler onClick quand cliqué après validation (disabled)', () => {
      const handleClick = vi.fn();

      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={true}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Le bouton est disabled, donc onClick ne devrait pas être appelé
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Combinaisons d\'états complexes', () => {
    it('bonne réponse sélectionnée et validée', () => {
      render(
        <OptionButton
          value="Bonne réponse"
          isSelected={true}
          isCorrect={true}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('correct');
      expect(button).toBeDisabled();
    });

    it('bonne réponse NON sélectionnée et validée', () => {
      render(
        <OptionButton
          value="Bonne réponse"
          isSelected={false}
          isCorrect={true}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('correct');
      expect(button).toBeDisabled();
    });

    it('mauvaise réponse sélectionnée et validée', () => {
      render(
        <OptionButton
          value="Mauvaise réponse"
          isSelected={true}
          isCorrect={false}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('incorrect');
      expect(button).toBeDisabled();
    });

    it('option neutre après validation (faded)', () => {
      render(
        <OptionButton
          value="Autre option"
          isSelected={false}
          isCorrect={false}
          isSubmitted={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('faded');
      expect(button.className).toContain('disabled');
      expect(button).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('devrait gérer une valeur vide', () => {
      render(
        <OptionButton
          value=""
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('devrait gérer une valeur null', () => {
      render(
        <OptionButton
          value={null}
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('devrait gérer une très longue valeur', () => {
      const longValue = 'A'.repeat(200);

      render(
        <OptionButton
          value={longValue}
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(longValue);
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir le role button', () => {
      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={() => {}}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('devrait être keyboard accessible', () => {
      const handleClick = vi.fn();

      render(
        <OptionButton
          value="Option A"
          isSelected={false}
          isCorrect={false}
          isSubmitted={false}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
