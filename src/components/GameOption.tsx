import {Box, Stack, Typography} from "@mui/material";
import {useState} from "react";

interface Props {
    isEnabled: boolean,
    onSelect: (enabled: boolean) => void,
    name: string,
    multiplier: number,
    hint: string,
}

interface CheckboxIndicatorProps {
    isEnabled: boolean,
    size?: number,
}

const CheckboxIndicator = ({ isEnabled, size = 28 }: Readonly<CheckboxIndicatorProps>) => (
    <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: size, height: size, flexShrink: 0 }}
    >
        <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="5"
            fill="none"
            stroke="white"
            strokeWidth="2"
        />
        {isEnabled && (
            <path
                d="M6.5 12.5L10 16L17.5 8"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        )}
    </Box>
);

export default function GameOption({ isEnabled, onSelect, name, multiplier, hint }: Readonly<Props>) {
    const [hover, setHover] = useState(false);
    return (
        <Stack
            direction="row"
            spacing={2}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => onSelect(!isEnabled)}
            sx={{
                backgroundColor: 'transparent',
                alignItems: "flex-start",
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
            }}
        >
            <CheckboxIndicator isEnabled={isEnabled} />
            <Stack direction="column" sx={{textAlign: "left"}}>
                <Typography sx={{ fontSize: "20px" }}>{name + ` (x${multiplier})`}</Typography>
                <Typography sx={{ fontSize: "14px", color: "white", visibility: hover ? "visible" : "hidden" }}>{hint}</Typography>
            </Stack>
        </Stack>
    )
}