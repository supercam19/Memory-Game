import React, { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";

export interface MemoryCard {
    id: number;
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
    isKnown: boolean;
}

type Props = {
    card: MemoryCard;
    onClick: () => void;
    width?: number;
    height?: number;
};

export const Card: React.FC<Props> = ({
      card,
      onClick,
  }: Readonly<Props>) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [hover, setHover] = useState(false);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
    const reacts = !(card.isFlipped || card.isMatched);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current || !reacts) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nx = (x / rect.width) - 0.5;
        const ny = (y / rect.height) - 0.5;

        setTilt({
            rx: ny * -24,
            ry: nx * 24,
        });
    };

    const resetTilt = () => {
        setHover(false);
        setTilt({ rx: 0, ry: 0 });
    };

    const transform = useMemo(() => {
        const lift = hover ? "translateY(-8px)" : "translateY(0px)";
        const flip = card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
        return `${lift} ${flip} rotateX(${tilt.rx}deg)`;
    }, [hover, tilt, card.isFlipped]);

    const dropShadow = () => {
        if (card.isMatched) return "0";
        return hover ? "0 18px 35px rgba(0,0,0,0.35)"
            : "0 8px 18px rgba(0,0,0,0.25)";
    }

    return (
        <Box
            ref={ref}
            onMouseEnter={() => setHover(reacts)}
            onMouseLeave={resetTilt}
            onMouseMove={handleMouseMove}
            onClick={() => {
                if (!card.isFlipped) resetTilt();
                onClick();
            }}
            sx={{
                width: "100%",
                height: "100%",
                perspective: "800px",
                cursor: card.isFlipped ? "default" : "pointer",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                    transform,
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: (theme) => theme.brand.darkpink,
                        borderRadius: 2,
                        backfaceVisibility: "hidden",
                        boxShadow: dropShadow(),
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: (theme) => theme.brand.pink,
                        borderRadius: 2,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 96,
                        fontWeight: 700,
                        boxShadow: dropShadow(),
                        color: "white",
                        userSelect: "none",
                    }}
                >
                    {card.isFlipped ? card.symbol : null}
                    {card.isMatched && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                borderRadius: 2,
                            }}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
};