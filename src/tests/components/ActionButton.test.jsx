import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../../components/exercise/ActionButton';

describe('ActionButton', () => {
  describe('Texte du bouton', () => {
    it('devrait afficher "Valider" avant validation', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      expect(screen.getByRole('button')).toHaveTextContent('Valider');
    });

    it('devrait afficher "Continuer" après validation', () => {
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      expect(screen.getByRole('button')).toHaveTextContent('Continuer');
    });
  });

  describe('État avant validation (isSubmitted = false)', () => {
    it('devrait avoir la classe "disabled" si isDisabled est true', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled');
      expect(button).toBeDisabled();
    });

    it('devrait avoir la classe "enabled" si isDisabled est false', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('enabled');
      expect(button).not.toBeDisabled();
    });

    it('ne devrait PAS être cliquable si disabled', () => {
      const handleClick = vi.fn();

      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={true}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('devrait être cliquable si enabled', () => {
      const handleClick = vi.fn();

      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('État après validation (isSubmitted = true)', () => {
    it('devrait avoir la classe "enabled" si isCorrect est true (bonne réponse)', () => {
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('enabled');
      expect(button.className).not.toContain('incorrect-state');
    });

    it('devrait avoir la classe "incorrect-state" si isCorrect est false (mauvaise réponse)', () => {
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={false}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('incorrect-state');
      expect(button.className).not.toContain('enabled');
    });

    it('ne devrait PAS être disabled après validation (pour cliquer "Continuer")', () => {
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('devrait être cliquable pour passer à l\'exercice suivant', () => {
      const handleClick = vi.fn();

      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Workflow complet', () => {
    it('workflow validation correcte : Valider (disabled) → Valider (enabled) → Continuer (correct)', () => {
      const handleClick = vi.fn();

      // Étape 1 : Pas d'option sélectionnée - Valider disabled
      const { rerender } = render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={true}
          onClick={handleClick}
        />
      );

      let button = screen.getByRole('button');
      expect(button).toHaveTextContent('Valider');
      expect(button.className).toContain('disabled');
      expect(button).toBeDisabled();

      // Étape 2 : Option sélectionnée - Valider enabled
      rerender(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      button = screen.getByRole('button');
      expect(button).toHaveTextContent('Valider');
      expect(button.className).toContain('enabled');
      expect(button).not.toBeDisabled();

      // Étape 3 : Après validation correcte - Continuer (vert)
      rerender(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      button = screen.getByRole('button');
      expect(button).toHaveTextContent('Continuer');
      expect(button.className).toContain('enabled');
      expect(button).not.toBeDisabled();
    });

    it('workflow validation incorrecte : Valider (enabled) → Continuer (incorrect)', () => {
      const handleClick = vi.fn();

      // Étape 1 : Option sélectionnée - Valider enabled
      const { rerender } = render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      let button = screen.getByRole('button');
      expect(button).toHaveTextContent('Valider');
      expect(button.className).toContain('enabled');

      // Étape 2 : Après validation incorrecte - Continuer (rouge)
      rerender(
        <ActionButton
          isSubmitted={true}
          isCorrect={false}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      button = screen.getByRole('button');
      expect(button).toHaveTextContent('Continuer');
      expect(button.className).toContain('incorrect-state');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Interactions multiples', () => {
    it('devrait appeler onClick à chaque clic si enabled', () => {
      const handleClick = vi.fn();

      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('ne devrait jamais appeler onClick si disabled', () => {
      const handleClick = vi.fn();

      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={true}
          onClick={handleClick}
        />
      );

      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('devrait gérer onClick undefined', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={undefined}
        />
      );

      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('devrait gérer les combinaisons illogiques (submitted=true, disabled=true)', () => {
      // Cas illogique mais ne devrait pas crasher
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Continuer');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir le role button', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('devrait être keyboard accessible si enabled', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('devrait indiquer visuellement l\'état disabled', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.className).toContain('disabled');
    });
  });

  describe('États visuels', () => {
    it('état vert (success) après bonne réponse', () => {
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={true}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('enabled');
    });

    it('état rouge (error) après mauvaise réponse', () => {
      render(
        <ActionButton
          isSubmitted={true}
          isCorrect={false}
          isDisabled={false}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('incorrect-state');
    });

    it('état gris (disabled) avant sélection', () => {
      render(
        <ActionButton
          isSubmitted={false}
          isCorrect={false}
          isDisabled={true}
          onClick={() => {}}
        />
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled');
    });
  });
});
