import { PlayerKey } from './players';

export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CardWild   = 'stop' | 'reverse' | 'changeColor' | '+2' | '+4';
export type CardValue = CardNumber | CardWild;
export type CardColor  = 'blue' | 'green' | 'orange' | 'red';

export interface Card {
  value: CardValue;
  color?: CardColor;
}

export interface CardComponent {
  onClick?: (card: Card, index: number, player: PlayerKey) => void;
  card: Card;
  index?: number;
  isDeck?: boolean;
  isHidden?: boolean;
}