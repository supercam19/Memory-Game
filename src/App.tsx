import {Box, createTheme, type Theme, ThemeProvider} from "@mui/material";
import Main from "./views/Main.tsx";
import Options, {type GameFlag} from "./views/Options.tsx";
import Game from "./views/Game.tsx";
import {useState} from "react";

interface FourColoured {
  pink: string;
  darkpink: string;
  lightpurple: string;
  purple: string;
}

declare module '@mui/material/styles' {
  interface ThemeOptions {
    brand?: FourColoured,
    darkened?: FourColoured,
  }

  interface Theme {
    brand: FourColoured,
    darkened: FourColoured,
  }
}

export type Screen = "main" | "options" | "game";
export type Difficulty = "easy" | "medium" | "hard";

export interface GameState {
    screen: Screen,
    difficulty: Difficulty,
    flags: Set<GameFlag>,
}

function App() {

  const theme: Theme = createTheme({
    brand: {
      pink: "#ffd0e0",
      darkpink: "#c39eba",
      lightpurple: "#876c94",
      purple: "#4c3a6e",
    },
    darkened: {
      pink: "#CCA7B4",
      darkpink: "#3E487A",
      lightpurple: "#617493",
      purple: "#CEC5B7",
    },
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
                  onFlagsChange={(flags) => setGs({...gs, flags: flags})}
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

  const [gs, setGs] = useState<GameState>({screen: "main", difficulty: "medium", flags: new Set()})

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
      </ThemeProvider>
  )
}

export default App
