import {Box, createTheme, type Theme, ThemeProvider} from "@mui/material";
import Main from "./views/Main.tsx";
import Options, {calculateMultiplier, type GameFlag} from "./views/Options.tsx";
import Game from "./views/Game.tsx";
import {useEffect, useMemo, useState} from "react";
import ThemeSelector, {getTheme} from "./components/ThemeSelector.tsx";
import {useAnimatedTheme} from "./hooks/AnimatedTheme.ts";

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

export type Screen = "main" | "options" | "game";
export type Difficulty = "easy" | "medium" | "hard";

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
              width: '100vw',
              height: '100vh',
              background: (theme) =>
                  `linear-gradient(to top, ${theme.brand.purple}, ${theme.brand.darkpink})`,
            }}
        >
            {view(gs.screen)}
        </Box>
          <ThemeSelector currentTheme={activeTheme} onThemeChange={setActiveTheme}/>
      </ThemeProvider>
  )
}

export default App