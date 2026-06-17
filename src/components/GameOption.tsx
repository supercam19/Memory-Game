import {Box, Stack, Typography} from "@mui/material";

interface Props {
    isEnabled: boolean,
    onSelect: (enabled: boolean) => void,
    children: string,
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

export default function GameOption({ isEnabled, onSelect, children }: Readonly<Props>) {

    return (
        <Stack
            direction="row"
            spacing={2}
            onClick={() => onSelect(!isEnabled)}
            sx={{
                backgroundColor: 'transparent',
                alignItems: "center",
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
            <Typography sx={{ fontSize: "20px" }}>{children}</Typography>
        </Stack>
    )
}