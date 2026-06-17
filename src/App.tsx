import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Box, createTheme, type Theme, ThemeProvider} from "@mui/material";
import Main from "./Pages/Main.tsx";
import Options from "./Pages/Options.tsx";
import Game from "./Pages/Game.tsx";

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

function App() {

  const theme: Theme = createTheme({
    brand: {
      pink: "#ffd0e0",
      darkpink: "#c39eba",
      lightpurple: "#876c94",
      purple: "#4c3a6e",
    },
    darkened: {
      pink: "#0A0E28",
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
          <BrowserRouter>
            <Routes>
              <Route path="/" Component={Main} />
              <Route path="/options" Component={Options} />
              <Route path="/play" Component={Game} />
            </Routes>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
  )
}

export default App
