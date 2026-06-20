import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import type {GameState} from "../App.tsx";
import type {Screen} from "../App.tsx";
import {useState} from "react";
import {Card, type MemoryCard} from "../components/Card.tsx";

interface Props {
    nav: (screen: Screen) => void,
    state: GameState,
}

const charSet = "☕🍪⚖️✈️🚀🚢🔎💡✂️🕰️🍕🍰🍎🌲☀️🌙🌊⚡🔥☂️⭐☁️🛎️🗽🏛️🪐🌎🍁🍓🌶️🍄"

function buildDeck(rows: number): MemoryCard[] {
    const segmenter = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
    });
    const chosenChars = new Array((rows * rows - (rows % 2))/2);
    const charPool = [...segmenter.segment(charSet)].map(segment => segment.segment);
    for (let i = 0; i < chosenChars.length; i++) {
        const pick = Math.floor(Math.random() * charPool.length);
        chosenChars[i] = charPool[pick];
        charPool.splice(pick, 1);
    }
    const paired = [...chosenChars, ...chosenChars];
    return paired
        .map((symbol) => ({ symbol, order: Math.random() }))
        .sort((a, b) => a.order - b.order)
        .map((entry, index) => ({
            id: index,
            symbol: entry.symbol,
            isFlipped: false,
            isMatched: false,
        }));
}

export default function Game({nav, state}: Readonly<Props>) {

    let cardDim;
    switch (state.difficulty) {
        case "easy":
            cardDim = 3;
            break;
        case "medium":
            cardDim = 4;
            break;
        case "hard":
            cardDim = 5;
            break;
    }

    const viewTime = 1000;

    const [cards, setCards] = useState(() => buildDeck(cardDim));
    const [flippedWaiting, setFlippedWaiting] = useState(-1);

    const cardClicked = (index: number) => {
        if (cards[index].isFlipped || cards[index].isMatched) return;
        setCards(prev => prev.map((card, i) => i === index ? {...card, isFlipped: true} : card));

        if (flippedWaiting >= 0) {
            if (cards[flippedWaiting].symbol === cards[index].symbol) {
                setTimeout(() => {
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[flippedWaiting].isMatched = true;
                        newCards[index].isMatched = true;
                        return newCards;
                    })
                }, 1000);
            } else {
                const curr = flippedWaiting;
                setTimeout(() => {
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[curr].isFlipped = false;
                        newCards[index].isFlipped = false;
                        return newCards;
                    });
                }, viewTime)
            }
            setFlippedWaiting(-1);
        } else {
            setFlippedWaiting(index);
        }

    }

    return (
        <Stack direction="row"
               sx={{
                   width: "100%",
                   height: "100%",
                   position: "relative",
                   alignItems: "center",
        }}>
            <Box sx={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}>
                <Button variant="contained"
                    onClick={() => nav("main")}
                    sx={{
                        bgcolor: (theme) => theme.brand.pink,
                        color: "black",
                        textTransform: "none",
                        margin: "10px",
                }}>
                    Exit
                </Button>
            </Box>
            <Stack
                spacing={2}
                sx={{
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "max-content",
                    justifyItems: "stretch",
                    justifyContent: "flex-start",
                }}
            >
                <Typography sx={{
                    fontFamily: "Playfair Display",
                    fontSize: "48px",
                    fontWeight: "5",
                    marginY: "20px",
                }}>
                    Card Matching Memory Game
                </Typography>
                <Box
                    sx={{
                        bgcolor: (theme) => theme.brand.purple,
                        width: "100%",
                        aspectRatio: "1",
                        display: "grid",
                        gridTemplateColumns: `repeat(${cardDim}, 1fr)`,
                        gridTemplateRows: `repeat(${cardDim}, 1fr)`,
                        gap: "10px",
                        padding: "10px",
                    }}

                >
                    {Array.from({ length: cardDim * cardDim }).map((_, gridIndex) => {
                        const middleIndex = Math.floor((cardDim * cardDim) / 2);
                        const isOddGrid = cardDim % 2 === 1;
                        const shouldSkipMiddle = isOddGrid && cards.length % 2 === 0;

                        if (shouldSkipMiddle && gridIndex === middleIndex) {
                            return <div key="empty-middle" />;
                        }

                        const cardIndex = shouldSkipMiddle && gridIndex > middleIndex 
                            ? gridIndex - 1 
                            : gridIndex;
                        const card = cards[cardIndex];

                        return (
                            <Card
                                key={card.id}
                                card={card}
                                onClick={() => cardClicked(cardIndex)}
                            />
                        );
                    })}
                </Box>
                <Typography sx={{ fontSize: "20px" }}>Click on cards to reveal their symbol and make matches</Typography>
            </Stack>
            <Stack sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                paddingRight: "10px",
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: "4px 12px",
                alignItems: "center",
                textAlign: "left",
            }}>
                <Typography sx={{ fontWeight: 5, fontSize: 24 }}>Score:</Typography>
                <Typography sx={{ fontWeight: 5, fontSize: 24, textAlign: "right" }}>0</Typography>
                <Divider sx={{ gridColumn: "1 / -1" }} />
                <Typography>Score Multiplier:</Typography>
                <Typography sx={{ textAlign: "right" }}>x1.00</Typography>
                <Typography>Modifiers Enabled:</Typography>
                <Typography sx={{ textAlign: "right" }}>No</Typography>
                <Typography>Time Elapsed:</Typography>
                <Typography sx={{ textAlign: "right" }}>0:00</Typography>
            </Stack>
        </Stack>
    )
}