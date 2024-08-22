import { Card } from './card';

export interface Deck {
  availableCards: Card[];
  releasedCards?: Card[];
  currentCard?: Card;
}