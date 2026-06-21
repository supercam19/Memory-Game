import {Box, Button, Divider, Stack, Typography, Zoom} from "@mui/material";
import type {GameState} from "../App.tsx";
import type {Screen} from "../App.tsx";
import {useEffect, useMemo, useState} from "react";
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
            isKnown: false,
            isHidden: false,
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

    const viewTime = state.flags.has('shortView') ? 300 : 1000;

    const [cards, setCards] = useState(() => buildDeck(cardDim));
    const [flippedWaiting, setFlippedWaiting] = useState(-1);
    const [secsElapsed, setSecsElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(() => Number(window.localStorage.getItem("highscore")))
    const [isStarted, setIsStarted] = useState(false);

    const restart = () => {
        setCards(() => buildDeck(cardDim));
        setFlippedWaiting(-1);
        setSecsElapsed(0);
        setScore(0);
        setIsStarted(false);
    }

    const cardClicked = (index: number) => {
        if (cards[index].isFlipped || cards[index].isMatched) return;
        setIsStarted(true);
        setCards(prev => prev.map((card, i) => i === index ? {...card, isFlipped: true} : card));

        if (flippedWaiting >= 0) {
            setCards(prev => {
                const newCards = [...prev];
                newCards[flippedWaiting].isHidden = false;
                return newCards;
            });
            if (cards[flippedWaiting].symbol === cards[index].symbol) {
                setTimeout(() => {
                    setScore(prev => prev + 100);
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[flippedWaiting].isMatched = true;
                        newCards[index].isMatched = true;
                        return newCards;
                    })
                }, 1000);
            } else {
                let curr = flippedWaiting;
                setTimeout(() => {
                    if (cards[curr].isKnown) setScore(prev => Math.max(prev - 25, 0));
                    if (cards[index].isKnown) setScore(prev => Math.max(prev - 25, 0));
                    if (cards[curr].isKnown && cards[index].isKnown && state.flags.has('failSwap')) {
                        const fixedPositions = new Set([curr, index]);
                        const shuffledMovable = cards
                            .filter((_, i) => !fixedPositions.has(i))
                            .map((card) => ({ value: card, order: Math.random() }))
                            .sort((a, b) => a.order - b.order)
                            .map((entry) => entry.value);

                        let movableIdx = 0;
                        setCards(cards.map((card, i) => {
                            if (fixedPositions.has(i)) {
                                return card;
                            }
                            return {
                                ...shuffledMovable[movableIdx++],
                                isKnown: false,
                            };
                        }));
                    }
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[curr].isKnown = true;
                        newCards[index].isKnown = true;
                        newCards[curr].isFlipped = false;
                        newCards[index].isFlipped = false;
                        return newCards;
                    });
                }, viewTime)
            }
            setFlippedWaiting(-1);
        } else {
            if (state.flags.has('hideSymbol')) {
                setTimeout(() => {
                    setCards(prev => {
                        const newCards = [...prev];
                        newCards[index].isHidden = true;
                        return newCards;
                    });
                }, viewTime)
            }
            setFlippedWaiting(index);
        }

    }

    const allMatched = useMemo(() => cards.findIndex(card => !card.isMatched) === -1, [cards]);

    useEffect(() => {
        if (allMatched || !isStarted) return;
        const interval = setInterval(() => {
            setSecsElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [allMatched, isStarted])

    useEffect(() => {
        if (allMatched) {
            const finalScore = score * state.multiplier * timeMult();
            try {
                const curr = window.localStorage.getItem("highscore");
                if (finalScore > Number(curr)) {
                    window.localStorage.setItem("highscore", finalScore.toString());
                    setHighscore(finalScore);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }, [allMatched, score])

    const timeMult = () => Math.max(Math.min(((15 * cardDim) - secsElapsed) / 15, 3), 0.5);

    return (
        <Stack direction={{ xs: "column", md: "row" }}
               sx={{
                   width: "100%",
                   height: "100%",
                   position: "relative",
                   alignItems: "center",
                   overflowY: { xs: "auto", md: "hidden" },
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
                    width: { xs: "100%", md: "auto" },
                    height: { xs: "auto", md: "100%" },
                    maxHeight: { xs: "none", md: "100%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: { xs: "flex-start", md: "center" },
                    minHeight: 0,
                    flexShrink: 0,
                    py: 2,
                    px: 2,
                }}
            >
                <Typography sx={{
                    fontFamily: "Playfair Display",
                    fontSize: { xs: "32px", md: "48px" },
                    fontWeight: "5",
                    marginY: { xs: "10px", md: "20px" },
                    textAlign: "center",
                    flexShrink: 0,
                }}>
                    Card Matching Memory Game
                </Typography>
                <Box
                    sx={{
                        bgcolor: (theme) => theme.brand.purple,
                        width: { xs: "min(90vw, 75vh)", md: "min(75vh, 100%)" },
                        aspectRatio: "1",
                        display: "grid",
                        gridTemplateColumns: `repeat(${cardDim}, 1fr)`,
                        gridTemplateRows: `repeat(${cardDim}, 1fr)`,
                        gap: "10px",
                        padding: "10px",
                        flexShrink: 1,
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
                                grayed={state.flags.has('monochrome')}
                            />
                        );
                    })}
                </Box>
                <Typography sx={{ fontSize: "20px", flexShrink: 0, textAlign: "center" }}>Click on cards to reveal their symbol and make matches</Typography>
            </Stack>
            <Stack sx={{
                position: { xs: "static", md: "absolute" },
                right: { md: 20 },
                top: { md: "50%" },
                transform: { md: "translateY(-50%)" },
                paddingRight: "10px",
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: "4px 12px",
                alignItems: "center",
                textAlign: "left",
                width: "fit-content",
                mx: { xs: "auto", md: 0 },
                mt: { xs: 2, md: 0 },
                mb: { xs: 4, md: 0 },
                flexShrink: 0,
            }}>
                <Typography sx={{ fontWeight: 5, fontSize: 24 }}>Score:</Typography>
                <Typography sx={{ fontWeight: 5, fontSize: 24, textAlign: "right" }}>{score}</Typography>
                <Divider sx={{ gridColumn: "1 / -1" }} />
                <Typography>Score Multiplier:</Typography>
                <Typography sx={{ textAlign: "right" }}>{state.multiplier.toFixed(2)}</Typography>
                <Typography>Modifiers Enabled:</Typography>
                <Typography sx={{ textAlign: "right" }}>{state.flags.size ? "Yes" : "No"}</Typography>
                <Typography>Time Elapsed:</Typography>
                <Typography sx={{ textAlign: "right" }}>{(Math.floor(secsElapsed / 60)).toFixed(0) + ":" + (secsElapsed % 60).toString().padStart(2, "0")}</Typography>
            </Stack>
            {allMatched &&
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                    }}
                >
                    <Zoom in={allMatched} style={{ transformOrigin: "center center" }} timeout={600}>
                        <Box
                            sx={{
                                bgcolor: (theme) => theme.brand.pink,
                                width: { xs: "90vw", sm: "550px" },
                                maxWidth: "550px",
                                height: { xs: "auto", sm: "350px" },
                                minHeight: { xs: "300px", sm: "350px" },
                                pointerEvents: "auto",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                                borderRadius: "5px",
                            }}
                        >
                            <Stack direction="column-reverse" sx={{
                                alignItems: "stretch",
                                justifyContent: "space-between",
                                height: "100%",
                            }}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        variant="contained"
                                        onClick={restart}
                                        sx={{
                                            bgcolor: (theme) => theme.brand.purple,
                                            width: "180px",
                                            fontSize: "20px",
                                            fontFamily: "Playfair Display",
                                            margin: "10px",
                                        }}
                                    >
                                        Play Again
                                    </Button>
                                </Box>
                                <Stack direction="column">
                                    <Typography style={{fontSize: "36px", color: "black"}}>You Win!</Typography>
                                    <Stack direction="column" sx={{
                                        margin: "10px",
                                        display: "grid",
                                        gridTemplateColumns: "auto auto",
                                        gap: "4px 12px",
                                        alignItems: "center",
                                        marginX: "20%",
                                        textAlign: "left",
                                        '& > *': {
                                            fontSize: "24px",
                                            color: "black",
                                        }
                                    }}>
                                        <Typography>Score: </Typography>
                                        <Typography sx={{textAlign: "right"}}>{score}</Typography>
                                        <Typography>Time Bonus ({secsElapsed}s): </Typography>
                                        <Typography sx={{textAlign: "right"}}>x{timeMult().toFixed(2)}</Typography>
                                        <Typography>Bonus Multiplier: </Typography>
                                        <Typography sx={{textAlign: "right"}}>x{state.multiplier.toFixed(2)}</Typography>
                                        <Typography>Final Score: </Typography>
                                        <Typography sx={{textAlign: "right"}}>{(score * state.multiplier * timeMult()).toFixed(0)}</Typography>
                                        <Typography>Your High Score: </Typography>
                                        <Typography sx={{textAlign: "right"}}>{highscore.toFixed(0)}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    </Zoom>
                </Box>}
        </Stack>
    )
}