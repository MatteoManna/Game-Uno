import { Card } from '../types/card';

// Check if is valid move
export const isValidMove = (card: Card, currentCard: Card) => card.value === currentCard.value || card.color === currentCard.color || (typeof card.value === 'string' && ['changeColor', '+4'].includes(card.value));

// If I have move, return false
export const isActiveNoMove = (cards: Card[], currentCard: Card) => {
	for (let i = 0; i < cards.length; i++) {
		if (isValidMove(cards[i], currentCard))	return false;
	}

	return true;
}