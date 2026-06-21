import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import "@fontsource/playfair-display/700.css"
import type {Screen, Difficulty} from "../App.tsx";

interface Props {
    nav: (screen: Screen) => void,
    difficulty: Difficulty,
    onDifficultyChange: (difficulty: Difficulty) => void,
}

export default function Main({nav, difficulty, onDifficultyChange}: Readonly<Props>) {

    return (
        <Box
            sx={{
                alignItems: "center",
                justifyContent: "center",
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
            }}
        >
            <Stack direction="column" spacing={2} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontFamily: "Playfair Display", fontSize: "72px", fontWeight: "5"}}>
                    Memory Mania
                </Typography>
                <Stack direction="row" spacing={2} sx={{ justifyContent: "center", }}>
                    <Button
                        variant="contained"
                        onClick={() => nav("options")}
                        sx={{
                            bgcolor: (theme) => theme.brand.pink,
                            color: "black",
                            width: "96px",
                            fontSize: "16px",
                            fontFamily: "Playfair Display",
                            textTransform: "none",
                        }}
                    >
                        Custom
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => nav("game1")}
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
                <FormControl sx={{ width: "fit-content", }}>
                    <InputLabel
                        sx={{
                            position: "relative",
                            top: 40,
                            left: -14,
                            '&.Mui-focused': {
                                color: "black",
                            },
                        }}
                    >Difficulty</InputLabel>
                    <Select
                        value={difficulty}
                        onChange={(event) => onDifficultyChange(event.target.value)}
                        variant="filled"
                        label="Difficulty"
                        sx={{
                            bgcolor: (theme) => theme.brand.darkpink,
                            alignContent: "center",
                        }}
                        MenuProps={{
                            slotProps: {
                                paper: {
                                    sx: {
                                        bgcolor: (theme) => theme.brand.darkpink,
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value={"easy"}>Easy</MenuItem>
                        <MenuItem value={"medium"}>Medium</MenuItem>
                        <MenuItem value={"hard"}>Hard</MenuItem>
                        <MenuItem value={"advanced"}>Advanced</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Box>
    )
}