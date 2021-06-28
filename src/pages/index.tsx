import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  LinearProgress,
  makeStyles,
  withWidth,
} from "@material-ui/core";
import { StarBorder } from "@material-ui/icons";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { array, object, string } from "yup";
import { MultipleFileUploadField } from "../upload/MultipleFileUploadField";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    "&:hover": {
      transform: "scale(1.02)",
      transition: "0.6s all ease !important",
      cursor: "pointer",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    marginTop: "20vh",
  },
  gridList: {
    // transform: "translateZ(0)",
    padding: "1rem",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
  remarkContainer: {
    textAlign: "center",
  },
}));

function Home({ width }) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);

  const [maxPopular, setMaxPopular] = useState(0);

  const [remark, setRemark] = useState("");

  var columns = width == "xs" ? 1 : width == "sm" ? 2 : 3;
  if (images.length < 3) {
    columns = width == "xs" ? 1 : images.length;
  }

  async function findPopularity(values) {
    setLoading(true);
    try {
      const res = await fetch("https://image-popularity1.herokuapp.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const resJson = await res.json();

      // add img manipulation arguments to img before setting to state
      const imgWidth = width == "xs" ? 234 : 400;
      const imgHeight = width == "xs" ? 158 : 280;

      // Set the max popular image
      setMaxPopular(Math.max(...resJson.files.map((o) => o.popularity)));
      console.log(resJson);
      console.log(maxPopular);

      setImages(
        resJson.files.map((file) => {
          var urlSplit = file.url.split("/");
          urlSplit.splice(6, 0, `w_${imgWidth},h_${imgHeight},c_pad,b_auto`);
          file.url = urlSplit.join("/");
          return file;
        })
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const reset = () => {
    setImages([]);
  };

  useEffect(() => {
    if (maxPopular < 1.5) {
      setRemark("It appears that your camera lens is a little shady 🧐");
    } else if (maxPopular < 2.5) {
      setRemark(
        "Just a little more work and you'll be professional photographer 🙃"
      );
    } else if (maxPopular < 4.5) {
      setRemark("This is a good click 📸");
    } else if (maxPopular < 6.5) {
      setRemark("Dude, It is an awesome picture 🤩");
    } else if (maxPopular < 7.5) {
      setRemark("Such amazing pictures need attention ASAP 🤐");
    } else {
      setRemark(
        "Woah! Something extraordinary appears to be in this picture 😱"
      );
    }
  }, [maxPopular]);

  return (
    <Card className={images.length > 0 ? "" : classes.cardContainer}>
      <CardContent>
        {images.length <= 0 ? (
          <Formik
            initialValues={{ files: [] }}
            validationSchema={object({
              files: array()
                .of(
                  object().shape({
                    url: string().required(),
                  })
                )
                .min(1, "Their should be atleast one image"),
            })}
            onSubmit={(values) => findPopularity(values)}
          >
            {({ values, errors, isValid, isSubmitting }) => (
              <Form>
                <Grid container spacing={2} direction="column">
                  <MultipleFileUploadField name="files" />

                  <Grid className={classes.buttonContainer} item>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isValid || isSubmitting || loading}
                      type="submit"
                    >
                      Predict
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <Box className={classes.remarkContainer} marginTop={2}>
              {remark}
            </Box>

            <GridList
              cellHeight="auto"
              spacing={5}
              className={classes.gridList}
              cols={columns}
            >
              {images.map((image, key) => (
                <GridListTile
                  className={classes.gridItem}
                  key={key}
                  cols={1}
                  rows={1}
                >
                  <img src={image.url} alt={image.path} />
                  <GridListTileBar
                    title={`${image.popularity}/8`}
                    titlePosition="top"
                    actionIcon={
                      image.popularity == maxPopular ? (
                        <IconButton className={classes.icon}>
                          <StarBorder />
                        </IconButton>
                      ) : (
                        ""
                      )
                    }
                    actionPosition="left"
                    className={classes.titleBar}
                  />
                </GridListTile>
              ))}
            </GridList>

            <Box marginTop={2}>
              <Grid className={classes.buttonContainer} item>
                <Button variant="contained" color="primary" onClick={reset}>
                  Go Back
                </Button>
              </Grid>
            </Box>
          </>
        )}
      </CardContent>
      {loading ? <LinearProgress /> : ""}
    </Card>
  );
}

export default withWidth()(Home);
