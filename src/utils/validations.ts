import { Card } from '../types/card';

// Check if is valid move
export const isValidMove = (card: Card, currentCard: Card) => card.value === currentCard.value || card.color === currentCard.color || (typeof card.value === 'string' && ['changeColor', '+4'].includes(card.value));