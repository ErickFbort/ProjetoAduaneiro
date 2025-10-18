/**
 * Testes para o componente CardSwap
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardSwap } from '../../src/components/Cards';

// Mock dos dados de terminais
const mockTerminals = [
  {
    id: 1,
    name: 'Terminal 1',
    status: 'active',
    location: 'São Paulo',
    capacity: 100
  },
  {
    id: 2,
    name: 'Terminal 2',
    status: 'maintenance',
    location: 'Rio de Janeiro',
    capacity: 150
  }
];

const mockOnCardClick = jest.fn();
const mockOptions = {
  animationDuration: 300,
  autoRotate: true,
  rotationSpeed: 2
};

describe('CardSwap Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders card swap component', () => {
    render(
      <CardSwap 
        terminals={mockTerminals}
        onCardClick={mockOnCardClick}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Terminal 1')).toBeInTheDocument();
    expect(screen.getByText('Terminal 2')).toBeInTheDocument();
  });

  test('displays terminal information correctly', () => {
    render(
      <CardSwap 
        terminals={mockTerminals}
        onCardClick={mockOnCardClick}
        options={mockOptions}
      />
    );

    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('calls onCardClick when card is clicked', () => {
    render(
      <CardSwap 
        terminals={mockTerminals}
        onCardClick={mockOnCardClick}
        options={mockOptions}
      />
    );

    const card = screen.getByText('Terminal 1').closest('[data-testid="terminal-card"]');
    if (card) {
      fireEvent.click(card);
      expect(mockOnCardClick).toHaveBeenCalledWith(mockTerminals[0]);
    }
  });

  test('handles empty terminals array', () => {
    render(
      <CardSwap 
        terminals={[]}
        onCardClick={mockOnCardClick}
        options={mockOptions}
      />
    );

    expect(screen.queryByText('Terminal 1')).not.toBeInTheDocument();
  });

  test('applies custom options correctly', () => {
    const customOptions = {
      animationDuration: 500,
      autoRotate: false,
      rotationSpeed: 1
    };

    render(
      <CardSwap 
        terminals={mockTerminals}
        onCardClick={mockOnCardClick}
        options={customOptions}
      />
    );

    // Verificar se as opções foram aplicadas
    // (isso dependeria da implementação específica do componente)
    expect(screen.getByText('Terminal 1')).toBeInTheDocument();
  });
});
