import cn from 'classnames';
import { CardValue, Card as CardType, CardComponent as Props } from '../types/card';

// Utils
import { cardColors } from '../utils/cards';

// Icons
import { ImBlocked } from 'react-icons/im';
import { FaExchangeAlt } from 'react-icons/fa';

// Css
import style from '../css/modules/Card.module.scss';

// Card "change color" or "+4"
const CardWild = ({ className }: { className: 'icon-changecolor' | 'icon-plus4' }) => (
  <span className={style[className]}>
    {cardColors.map((color, key) => <span key={key} className={style[color]} />)}
  </span>
);

// Parse card value
const parseValue = (value: CardValue) => {
  if (typeof value === 'number' || value === '+2') return value;

  switch (value) {
    case 'stop':
      return <ImBlocked />;
    case 'reverse':
      return <FaExchangeAlt className={style['icon-reverse']} />;
    case 'changeColor':
      return <CardWild className="icon-changecolor" />;
    case '+4':
      return <CardWild className="icon-plus4" />;
  }
}

export default function Card({ onClick, card, index, isDeck, isHidden }: Props) {
  const { value, color } = card;
  const parsedValue = parseValue(value);

  // Click card
  const handleClickCard = (card: CardType) => () => {
    if (onClick && typeof index !== 'undefined') onClick(card, index, 'p1');
  };

  return (
    <div
      onClick={handleClickCard(card)}
      className={cn(
        style['card'],
        color && !isHidden ? style[color] : style['black'],
        onClick && style['is-active'],
        isDeck && style['is-deck']
      )}
    >
      {isHidden ? (
        <div className={style['row-back']}>Uno!</div>
      ) : (
        <>
          <div className={style['row-1']}>
            {value === '+4' ? value : parsedValue}
          </div>
          <div className={style['row-2']}>
            {typeof value === 'number' && [6, 9].includes(value) ? (
              <span className={style['underline']}>
                {parsedValue}
              </span>
            ) : parsedValue}
          </div>
          <div className={style['row-3']}>
            {value === '+4' ? value : parsedValue}
          </div>
        </>
      )}
    </div>
  );
}