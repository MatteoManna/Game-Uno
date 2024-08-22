import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Modal, Badge } from 'react-bootstrap';

// Types
import { Players, PlayerKey } from '../types/players';
import { Deck } from '../types/deck';
import { CardColor, Card as CardProps } from '../types/card';
import { ModalProps } from '../types/modal';

// Utils
import { cards, cardColors, shuffleCards } from '../utils/cards';
import { isValidMove, isActiveNoMove } from '../utils/validations';
import { getNewPlayer } from '../utils/players';

// Components
import Card from './Card';

export default function Game() {
  // Modal
  const [modal, setModal] = useState<ModalProps>({
    isActive: false,
    canClose: true,
    title: '',
    content: ''
  })

  // Is the game started
  const [isStarted, setIsStarted] = useState(false);

  // Players
  const [players, setPlayers] = useState<Players>({
    p1: [],
    p2: [],
    currentPlayer: 'p1',
    canPickCard: true
  });
  const { p1, p2, currentPlayer, canPickCard } = players;

  // Bool if turn is mine
  const isMyTurn = currentPlayer === 'p1';

  // Deck
  const [deck, setDeck] = useState<Deck>({
    availableCards: []
  });
  const { availableCards, releasedCards, currentCard } = deck;

  // Change player
  const changePlayer = () => setPlayers(prev => ({
    ...prev,
    currentPlayer: getNewPlayer(prev.currentPlayer),
    canPickCard: true
  }));

  // Pick card by player
  const pickCard = useCallback((player: PlayerKey, cardCount = 1) => {
    // Set player
    setPlayers(prev => ({
      ...prev,
      [player]: prev[player].concat(availableCards.slice(0, cardCount)),
      canPickCard: false
    }));

    // Set deck
    setDeck(prev => ({
      ...prev,
      availableCards: prev.availableCards.filter((_, key) => key > cardCount - 1)
    }));
  }, [availableCards]);

  // Handle pick card by player
  const handleClickPickCard = (player: PlayerKey) => () => pickCard(player);

  // Change color
  const changeColor = useCallback((color: CardColor) => {
    // Change player
    changePlayer();

    // Set clicked color
    setDeck(prev => ({
      ...prev,
      currentCard: {
        value: prev.currentCard?.value ?? 'changeColor',
        color: color
      }
    }));

    // Close modal
    setModal(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  // Handle click change color
  const handleChangeColor = useCallback((color: CardColor) => () => changeColor(color), [changeColor]);

  // Click card
  const clickCard = useCallback((card: CardProps, index: number, player: PlayerKey) => {
    const { value } = card;

    if (currentCard && isValidMove(card, currentCard)) {
      // Set player
      setPlayers(prev => ({
        ...prev,
        [player]: prev[player].filter((_, key) => index !== key)
      }));

      // Set deck
      setDeck(prev => ({
        ...prev,
        currentCard: card,
        releasedCards: prev.releasedCards?.concat(card) ?? [card]
      }));

      // If "change color" or "+4"
      if (typeof value === 'string' && ['changeColor', '+4'].includes(value)) {
        // If me
        if (isMyTurn) {
          // Open modal
          setModal({
            isActive: true,
            canClose: false,
            title: 'Select current color',
            content: (
              <div className="d-flex gap-3 justify-content-center">
                {cardColors.map((color, key) => (
                  <div
                    key={key}
                    onClick={handleChangeColor(color)}
                    className={`change-color bg-${color}`}
                  />
                ))}
              </div>
            )
          });
        } else {
          // Iteration of computer cards
          for (let i = 0; i < p2.length; i++) {
            // Get color of current card
            const cardColor = p2[i].color;
            
            // If there is color
            if (cardColor) {
              // Change color and break the loop
              changeColor(cardColor);
              changePlayer();
              break;
            }
          }
        }
      }

      // If "+2" or "+4"
      if (typeof value === 'string' && ['+2', '+4'].includes(value)) {
        // If "+2" change player
        if (value === '+2') changePlayer();

        // Pick
        pickCard(getNewPlayer(player), value === '+2' ? 2 : 4);
      }

      // If not "stop" or "reverse" or "changeColor" change player
      if (typeof value === 'number' || (typeof value === 'string' && !['stop', 'reverse', 'changeColor'].includes(value))) changePlayer();

      return true;
    }

    // Move not allowed, modal in
    if (isMyTurn) {
      setModal({
        isActive: true,
        canClose: true,
        title: 'Error',
        content: 'Move not allowed.'
      });
    }

    return false;
  }, [currentCard, handleChangeColor, changeColor, isMyTurn, pickCard, p2]);

  // Handle click card
  const handleClickCard = (card: CardProps, index: number, player: PlayerKey) => clickCard(card, index, player);

  // Click start
  const handleClickStart = () => {
    // Set the game is started
    setIsStarted(true);

    // Shuffle cards
    shuffleCards(cards);

    // Set players
    setPlayers(prev => ({
      ...prev,
      p1: cards.slice(0, 7),
      p2: cards.slice(7, 14)
    }));

    // Set deck
    setDeck({
      availableCards: cards.slice(15, cards.length),
      currentCard: cards.slice(14, 15)[0]
    });
  };

  // Handle click restart
  const handleClickRestart = () => setModal({
    isActive: true,
    canClose: true,
    title: 'Are you sure!?',
    content: (
      <>
        <p>You will lose this game data and nothing will be saved.</p>
        <div className="text-center">
          <Button onClick={handleClickModalRestart} variant="danger">Yes, restart</Button>
        </div>
      </>
    )
  });

  // Click restart by modal
  const handleClickModalRestart = () => {
    // Restart the game
    handleClickStart();

    // Close the modal
    setModal(prev => ({
      ...prev,
      isActive: false
    }));
  };
  
  useEffect(() => {
    if (currentPlayer === 'p2' && (p1.length > 0 || p2.length > 0)) {
      // Iterate computer cards
      for (let i = 0; i < p2.length; i++) {
        // Check if is valid move
        const isValidMove = clickCard(p2[i], i, 'p2');
        
        // If is valid move stop
        if (isValidMove) {
          console.log('current', currentCard, 'analyzed card', p2[i]);
          break;
        // If not valid move and it's the last card pick card and change player
        } else if (i === p2.length - 1) {
          pickCard(currentPlayer, 1);
          changePlayer();
        }
      }
    }
  }, [currentPlayer, p1.length, p2, clickCard, pickCard, currentCard]);

  // Start
  if (!isStarted) {
    return (
      <Container className="py-3">
        <Button
          onClick={handleClickStart}
          className="mb-4"
        >
          Start
        </Button>
      </Container>
    );
  }

  // If somebody wins
  if (isStarted && (p1.length === 0 || p2.length === 0)) {
    return (
      <Container className="py-3">
        <Button
          onClick={handleClickStart}
          className="mb-4"
        >
          Restart
        </Button>
        {p1.length === 0 &&
          <h1 className="text-success">You win!</h1>
        }
        {p2.length === 0 &&
          <h1 className="text-danger">Computer wins!</h1>
        }
      </Container>
    );
  }

  return (
    <>
      <Container className="py-3">
        <div className="text-end">
          <Button
            onClick={handleClickRestart}
            variant="danger"
          >
            Restart
          </Button>
        </div>
        <Row>
          <Col lg={6}>
            <h3>Deck</h3>
            {currentCard &&
              <Card
                card={currentCard}
              />
            }
          </Col>
          {releasedCards && releasedCards.length > 1 &&
            <Col lg={6} className="mt-3 mt-lg-0">
              <h3>Latest 5 released cards</h3>
              <div className="d-flex">
                {releasedCards.slice(-6, -1).map((card, key) => (
                  <Card
                    key={key}
                    card={card}
                    isDeck
                  />
                ))}
              </div>
            </Col>
          }
        </Row>
        {[p1, p2].map((cards, key1) => (
          <div key={key1} className="mt-4">
            <div className="d-flex align-items-center mb-2">
              <h3 className="mb-0">Player {key1 + 1} ({key1 === 0 ? 'you' : 'computer'})</h3>
              {cards.length === 1 &&
                <Badge bg="danger" className="text-uppercase ms-3">
                  Uno!
                </Badge>
              }
              {key1 === 0 &&
                <>
                  <Button
                    onClick={handleClickPickCard('p1')}
                    size="sm"
                    className="ms-3"
                    disabled={!isMyTurn || !canPickCard}
                  >
                    Pick card
                  </Button>
                  <Button
                    onClick={() => changePlayer()}
                    size="sm"
                    className="ms-1"
                    disabled={!isMyTurn || canPickCard || (currentCard && !isActiveNoMove(p1, currentCard))}
                  >
                    No move
                  </Button>
                </>
              }
            </div>
            <div className="d-flex flex-wrap gap-1">
              {cards.map((item, key2) => (
                <Card
                  key={key2}
                  index={key2}
                  onClick={key1 === 0 && isMyTurn ? handleClickCard : undefined}
                  card={item}
                  isHidden={key1 > 0}
                  isDeck={key1 > 0}
                />
              ))}
            </div>
          </div>
        ))}
      </Container>
      <Modal
        show={modal.isActive}
        onHide={() => setModal(prev => ({ ...prev, isActive: false }))}
        backdrop={!modal.canClose ? 'static' : undefined}
        centered
      >
        <Modal.Header closeButton={modal.canClose}>
          <Modal.Title>
            {modal.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          {modal.content}
        </Modal.Body>
        {modal.canClose &&
          <Modal.Footer>
            <Button
              onClick={() => setModal(prev => ({ ...prev, isActive: false }))}
              variant="secondary"
            >
              Close
            </Button>
          </Modal.Footer>
        }
      </Modal>
    </>
  );
}