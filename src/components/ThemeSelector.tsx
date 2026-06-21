import { useState } from "react";
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import type {FourColoured} from "../App.tsx";

interface Props {
    currentTheme: string;
    onThemeChange: (value: string) => void;
}

export const THEME_OPTIONS = [
    { value: "dusk", label: "Dusk", theme: {
            pink: "#ffd0e0",
            darkpink: "#c39eba",
            lightpurple: "#876c94",
            purple: "#4c3a6e",
        }
    },
    { value: "sunset", label: "Sunset", theme: {
            pink: "#FFF0BE",
            darkpink: "#FFD6A6",
            lightpurple: "#FFB399",
            purple: "#FF9A86"
    }},
    { value: "candy", label: "Cotton Candy", theme: {
            pink: "#EEA5A6",
            darkpink: "#E493B3",
            lightpurple: "#B784B7",
            purple: "#8E7AB5",
    }},
    { value: "winter", label: "Winter", theme: {
            pink: "#FFF2E0",
            darkpink: "#C0C9EE",
            lightpurple: "#A2AADB",
            purple: "#898AC4",
    }},
    { value: "galaxy", label: "Galaxy", theme: {
            pink: "#FF70BF",
            darkpink: "#D552A3",
            lightpurple: "#831C91",
            purple: "#462C7D",
    }},
];

export function getTheme(value: string): FourColoured {
    return (THEME_OPTIONS.find((option) => option.value === value) ?? THEME_OPTIONS[0]).theme;
}

function ThemeSelector({ currentTheme, onThemeChange }: Readonly<Props>) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeSelect = (event: any) => {
        onThemeChange(event.target.value);
        //handleClose();
    };

    return (
        <>
            <Fab
                onClick={handleOpen}
                sx={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    bgcolor: (theme) => theme.brand.pink,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                }}
            >
                <img src="/theme.png" alt="theme" width="24px" height="24px" />
            </Fab>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: (theme) => theme.brand.purple,
                        },
                    },
                }}
            >
                <MenuItem disabled sx={{ opacity: "1 !important" }}>
                    <Typography variant="subtitle2">Pick Theme</Typography>
                </MenuItem>
                <RadioGroup
                    value={currentTheme}
                    onChange={handleThemeSelect}
                    sx={{
                        px: 2,
                        pb: 1,
                        '& .MuiRadio-root': {
                            color: "white",
                        },
                        '& .Mui-checked': {
                            color: "white",
                        },
                    }}
                >
                    {THEME_OPTIONS.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" />}
                            label={option.label}
                            sx={{
                                color: "white",
                                '&.Mui-checked': {
                                    color: "white",
                                },
                            }}
                        />
                    ))}
                </RadioGroup>
            </Menu>
        </>
    );
}

export default ThemeSelector;