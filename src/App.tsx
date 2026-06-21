import {Box, createTheme, type Theme, ThemeProvider} from "@mui/material";
import Main from "./views/Main.tsx";
import Options, {calculateMultiplier, type GameFlag} from "./views/Options.tsx";
import Game from "./views/Game.tsx";
import {useEffect, useMemo, useState} from "react";
import ThemeSelector, {getTheme} from "./components/ThemeSelector.tsx";
import {useAnimatedTheme} from "./hooks/AnimatedTheme.ts";
import { AnimatePresence, motion } from "framer-motion";

export interface FourColoured {
  pink: string;
  darkpink: string;
  lightpurple: string;
  purple: string;
}

declare module '@mui/material/styles' {
  interface ThemeOptions {
    brand?: FourColoured,
  }

  interface Theme {
    brand: FourColoured,
  }
}

export type Screen = "main" | "options" | "game" | "game1";
export type Difficulty = "easy" | "medium" | "hard" | "advanced";

export interface GameState {
    screen: Screen,
    difficulty: Difficulty,
    flags: Set<GameFlag>,
    multiplier: number,
}

function App() {

    const themePref = localStorage.getItem("theme");

  const [activeTheme, setActiveTheme] = useState<string>(themePref ?? "dusk");

  const targetTheme = useMemo(() => getTheme(activeTheme), [activeTheme]);
  const animatedTheme = useAnimatedTheme(targetTheme);

  const theme: Theme = createTheme({
    brand: animatedTheme,
    typography: {

    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#FFF',
            fontFamily: "Roboto",
          },
        },
      },
    },
  });

  useEffect(() => {
      try {
          localStorage.setItem("theme", activeTheme);
      } catch (e) {
          console.error(e);
      }
  }, [activeTheme])

  const view = (screen: Screen) => {
      switch (screen) {
          case "main":
              return <Main
                nav={nav}
                difficulty={gs.difficulty}
                onDifficultyChange={(difficulty) => setGs({...gs, difficulty: difficulty})}
              />
          case "options":
              return <Options
                  nav={nav}
                  flags={gs.flags}
                  onFlagsChange={(flags) => setGs({...gs, flags: flags, multiplier: calculateMultiplier(flags)})}
              />
          case "game":
              return <Game
                nav={nav}
                state={gs}
              />
          case "game1":
              return <Game
                  nav={nav}
                  state={{...gs, flags: new Set(), multiplier: 1}}
              />
      }
  }

  const nav = (screen: Screen) => {
      setGs({...gs, screen: screen})
  }

  const [gs, setGs] = useState<GameState>({screen: "main", difficulty: "medium", flags: new Set(), multiplier: 1})

  return (
      <ThemeProvider theme={theme}>
        <Box
            sx={{
              minWidth: '100vw',
              minHeight: '100vh',
              background: (theme) =>
                  `linear-gradient(to top, ${theme.brand.purple}, ${theme.brand.darkpink})`,
            }}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={gs.screen}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {view(gs.screen)}
                </motion.div>
            </AnimatePresence>
        </Box>
          <ThemeSelector currentTheme={activeTheme} onThemeChange={setActiveTheme}/>
      </ThemeProvider>
  )
}

export default App