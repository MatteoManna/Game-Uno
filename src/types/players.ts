import { Card } from './card';

export type PlayerKey = 'p1' | 'p2';

export interface Players {
  p1: Card[];
  p2: Card[];
  currentPlayer: PlayerKey;
}