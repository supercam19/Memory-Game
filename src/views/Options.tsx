import {Box, Button, Stack, Typography} from "@mui/material";
import GameOption from "../components/GameOption.tsx";
import type {Screen} from "../App.tsx";

export type GameFlag = "monochrome" | "shortView" | "hideSymbol" | "failSwap";

interface FlagDetails {
    name: string,
    flag: GameFlag,
    mult: number,
    hint: string,
}

interface Props {
    nav: (screen: Screen) => void,
    flags: Set<GameFlag>
    onFlagsChange: (flags: Set<GameFlag>) => void,
}

const flagsOpts: FlagDetails[] = [
    {name: "Monochrome", flag: "monochrome", mult: 1.1, hint: "Makes all symbols monochrome"},
    {name: "Shorter View Time", flag: "shortView", mult: 1.5, hint: "Reduces the time you have to view symbols"},
    {name: "Ghost Symbols", flag: "hideSymbol", mult: 1.5, hint: "Symbols disappear shortly after you view them"},
    {name: "Perfectionism", flag: "failSwap", mult: 2, hint: "Failing to match two cards shuffles the entire board"}
]

export function calculateMultiplier(flags: Set<GameFlag>) {
    return [...flags].reduce((acc, flag) => acc * (flagsOpts.find(x => x.flag === flag)?.mult ?? 1), 1)
}

export default function Options({nav, flags, onFlagsChange}: Readonly<Props>) {

    const scoreMultiplier = calculateMultiplier(flags);

    return (
        <Box sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
        }}>
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
                                    onFlagsChange(new Set([...flags, opt.flag]))
                                    : onFlagsChange(new Set([...flags].filter(x => x !== opt.flag)))}
                                name={opt.name}
                                multiplier={opt.mult}
                                hint={opt.hint}
                            />
                        ))}
                    </Stack>
                </Stack>

                <Box sx={{ flexGrow: 1 }} /> {/* Absorbs vertical space */}

                <Typography sx={{ marginBottom: "8px" }}>{"Score Multiplier x" + scoreMultiplier.toFixed(2)}</Typography>
                <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onFlagsChange(new Set());
                            nav("main");
                        }}
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
                        onClick={() => nav("game")}
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