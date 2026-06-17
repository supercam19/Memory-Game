import {Box, Button, Stack, Typography} from "@mui/material";
import GameOption from "../components/GameOption.tsx";
import React, {useState} from "react";

type GameFlag = "monochrome" | "shortView"

interface FlagDetails {
    name: string,
    flag: GameFlag,
    mult: number
}

export default function Options() {

    const flagsOpts: FlagDetails[] = [
        {name: "Monochrome", flag: "monochrome", mult: 1.1},
        {name: "Shorter View Time", flag: "shortView", mult: 1.5},
    ]

    const [flags, setFlags] = useState<Set<GameFlag>>(new Set())
    const scoreMultiplier = [...flags].reduce((acc, flag) => acc * (flagsOpts.find(x => x.flag === flag)?.mult ?? 1), 1)

    return (
        <Box sx={{ height: "100%", width: "100%"}}>
            <Stack direction="column" sx={{
                height: "97%",
                alignItems: "center",
                marginBottom: "3%",
            }}>
                <Stack
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "max-content",
                        justifyItems: "stretch",
                    }}
                >
                    <Typography sx={{ fontFamily: "Playfair Display", fontSize: "48px", fontWeight: "5" }}>
                        Customize Game
                    </Typography>
                    <Stack direction="column" sx={{ width: "100%" }}>
                        {flagsOpts.map((opt) => (
                            <GameOption
                                key={opt.flag}
                                isEnabled={flags.has(opt.flag)}
                                onSelect={(isEnabled) => isEnabled ?
                                    setFlags(new Set([...flags, opt.flag]))
                                    : setFlags(new Set([...flags].filter(x => x !== opt.flag)))}
                            >
                                {`${opt.name} (x${opt.mult})`}
                            </GameOption>
                        ))}
                    </Stack>
                </Stack>

                <Box sx={{ flexGrow: 1 }} /> {/* Absorbs vertical space */}

                <Typography sx={{ marginBottom: "8px" }}>{"Score Multiplier x" + scoreMultiplier.toFixed(2)}</Typography>
                <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: (theme) => theme.brand.pink,
                            color: "black",
                            width: "96px",
                            fontSize: "16px",
                            fontFamily: "Playfair Display",
                            textTransform: "none",
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: (theme) => theme.brand.purple,
                            width: "96px",
                            fontSize: "20px",
                            fontFamily: "Playfair Display",
                        }}
                    >
                        Play
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}