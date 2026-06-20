import { useEffect, useRef, useState } from "react";
import type { FourColoured } from "../App.tsx";

function hexToRgb(hex: string) {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function rgbToHex(r: number, g: number, b: number) {
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerpColor(start: string, end: string, t: number) {
    const c1 = hexToRgb(start);
    const c2 = hexToRgb(end);
    return rgbToHex(
        c1.r + (c2.r - c1.r) * t,
        c1.g + (c2.g - c1.g) * t,
        c1.b + (c2.b - c1.b) * t,
    );
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

export function useAnimatedTheme(targetTheme: FourColoured, duration = 600) {
    const [displayedTheme, setDisplayedTheme] = useState<FourColoured>(targetTheme);
    const fromThemeRef = useRef<FourColoured>(targetTheme);
    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        fromThemeRef.current = displayedTheme; // animate from current displayed colors
        startTimeRef.current = null;

        const step = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }
            const elapsed = timestamp - startTimeRef.current;
            const rawT = Math.min(elapsed / duration, 1);
            const t = easeOutCubic(rawT);

            setDisplayedTheme({
                pink: lerpColor(fromThemeRef.current.pink, targetTheme.pink, t),
                darkpink: lerpColor(fromThemeRef.current.darkpink, targetTheme.darkpink, t),
                lightpurple: lerpColor(fromThemeRef.current.lightpurple, targetTheme.lightpurple, t),
                purple: lerpColor(fromThemeRef.current.purple, targetTheme.purple, t),
            });

            if (rawT < 1) {
                rafRef.current = requestAnimationFrame(step);
            }
        };

        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetTheme]);

    return displayedTheme;
}