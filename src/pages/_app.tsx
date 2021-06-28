import {
  AppBar,
  Box,
  Container,
  createStyles,
  CssBaseline,
  IconButton,
  Link,
  makeStyles,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "../theme";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1,
    },

    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    footer: {
      position: "fixed",
      bottom: "2rem",
      textAlign: "center",
      width: "100%",
      fontSize: "1rem",
    },

    brandLink: {
      textDecoration: "none",
      color: "#3f51b5",
      fontWeight: "bold",
    },
  })
);

export default function MyApp({ Component, pageProps }: AppProps) {
  const classes = useStyles();
  const [theme, setTheme] = useState(darkTheme);
  const isDarkTheme = theme === darkTheme;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Multiple File Upload</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar variant="dense">
            <Typography variant="h6" className={classes.title}>
              Image Popularity Prediction
            </Typography>

            <IconButton
              aria-label={
                isDarkTheme ? "Change to Light Theme" : "Change to Dark Theme"
              }
              onClick={() => {
                const newTheme = isDarkTheme ? lightTheme : darkTheme;
                setTheme(newTheme);
              }}
            >
              {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Container className={classes.container}>
          <Box marginY={8}>
            <Component {...pageProps} />
          </Box>
        </Container>
      </ThemeProvider>
      <div className={classes.footer}>
        DM your queries{" "}
        <a
          className={classes.brandLink}
          href="https://www.instagram.com/lazy.coders/"
        >
          @lazy.coders
        </a>
      </div>
    </React.Fragment>
  );
}
