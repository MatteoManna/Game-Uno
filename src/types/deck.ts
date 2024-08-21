import { Card } from './card';

export interface Deck {
  availableCards: Card[];
  notAvailableCards: Card[];
  currentCard?: Card;
}