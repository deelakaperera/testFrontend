import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { IpAddrInformation } from "./components/Information";
import {
  Container,
  TextField,
  Box,
  AppBar,
  Modal,
  Typography,
  Toolbar,
  Button,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IntervalMsContext } from "./context/useIntervalMs";
import { IIps } from "./types";
import { useLocalStorage } from "./hooks";

const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [ips, setIps] = useState<IIps[]>([
    {
      name: "home",
      ipaddr: "127.0.0.1",
    },
  ]);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [open, setOpen] = useState(false);
  const [registeringIp, setRegisteringIp] = useState<string | null>(null);
  const [registeringName, setRegisteringName] = useState<string | null>(null);

  const registerNewIp = () => {
    setIps((ips) => [
      ...ips,
      {
        name: registeringName,
        ipaddr: registeringIp,
      },
    ]);
    console.log(ips);
  };

  const value = { intervalMs, setIntervalMs };

  return (
    <ThemeProvider theme={darkTheme}>
      <IntervalMsContext.Provider value={value}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40%",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Register new service
              </Typography>

              <TextField
                sx={{
                  mt: 2,
                }}
                fullWidth
                value={registeringIp}
                onChange={(e) => setRegisteringIp(e.target.value)}
                id="outlined-basic"
                label="Ip Address"
                variant="outlined"
              />

              <TextField
                sx={{
                  mt: 2,
                }}
                fullWidth
                id="outlined-basic"
                value={registeringName}
                onChange={(e) => setRegisteringName(e.target.value)}
                label="Service Name"
                variant="outlined"
              />
              <Button
                sx={{ mt: 3 }}
                fullWidth
                variant="contained"
                onClick={() => registerNewIp()}
              >
                submit
              </Button>
            </Box>
          </Modal>

          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <Button color="inherit" onClick={() => setOpen(true)}>
                Register Service
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl">
            <Typography variant="h3" component="h3" sx={{ mt: 5 }}>
              QOS Monitor
            </Typography>

            {ips ? (
              <>
                {ips?.map((ip) => {
                  return (
                    <>
                      <IpAddrInformation ipAddr={ip} />
                    </>
                  );
                })}
              </>
            ) : (
              <> no results found</>
            )}
          </Container>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </IntervalMsContext.Provider>
    </ThemeProvider>
  );
}

export default App;
