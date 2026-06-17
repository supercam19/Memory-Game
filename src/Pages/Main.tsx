import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import "@fontsource/playfair-display/700.css"

export default function Main() {
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

    return (
        <Box
            sx={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                display: "flex",
            }}
        >
            <Stack direction="column" spacing={2} sx={{ alignItems: "center" }}>
                <Typography sx={{ fontFamily: "Playfair Display", fontSize: "48px", fontWeight: "5"}}>
                    Card Matching Memory Game
                </Typography>
                <Stack direction="row" spacing={2} sx={{ justifyContent: "center", }}>
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
                        Custom
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
                <FormControl sx={{ width: "fit-content", }}>
                    <InputLabel sx={{ bgcolor: (theme) => theme.brand.darkpink }}>Difficulty</InputLabel>
                    <Select
                        value={difficulty}
                        onChange={(event) => setDifficulty(event.target.value)}
                        variant="filled"
                        sx={{
                            bgcolor: (theme) => theme.brand.darkpink,
                        }}
                    >
                        <MenuItem value={"easy"}>Easy</MenuItem>
                        <MenuItem value={"medium"}>Medium</MenuItem>
                        <MenuItem value={"hard"}>Hard</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Box>
    )
}