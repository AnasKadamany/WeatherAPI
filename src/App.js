import "./App.css";

//React Components
import { useEffect, useState } from "react";

//materialUI Components
import { Container, Typography, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardMedia from "@mui/material/CardMedia";
import CloudIcon from "@mui/icons-material/Cloud";
import Box from "@mui/material/Box";

//Other Components
import moment from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "moment/locale/ar";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
let cancelAxios = null;

// Handelers

function App() {
  moment.locale("en");
  const handleLanguageClick = () => {
    if (Language === "العربية") {
      i18n.changeLanguage("ar");
      moment.locale("ar");
      setLanguage("English");
    } else if (Language === "English") {
      i18n.changeLanguage("en");
      moment.locale("en");
      setLanguage("العربية");
    }
    setDate(moment().format("DD MMMM YYYY"));
  };

  const [Date, setDate] = useState(moment().format("D MMMM YYYY"));
  const { t, i18n } = useTranslation();
  const [Language, setLanguage] = useState("العربية");
  const [Temp, setTemp] = useState({
    number: null,
    description: "",
    min: "",
    max: "",
    icon: null,
  });

  useEffect(() => {
    i18n.changeLanguage("en");
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=31.77&lon=35.21&appid=1cc20ab6c8223281e70e121bd5e7521f",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        let Temperature = Math.round(response.data.main.temp - 272.15);
        let min = Math.round(response.data.main.temp_min - 272.15);
        let max = Math.round(response.data.main.temp_max - 272.15);
        let description = response.data.weather[0].description;

        let icon =
          "https://openweathermap.org/img/wn/" +
          response.data.weather[0].icon +
          "@2x.png";
        setTemp({
          number: Temperature,
          min: min,
          max: max,
          description: description,
          icon: icon,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      cancelAxios();
    };
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0048ca",
      }}
    >
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Card
            style={{ background: "#0a3f9e", color: "white" }}
            sx={{ minWidth: 275 }}
          >
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: "20px",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  {t("Jerusalem")}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  {Date}
                </Typography>
              </div>
              <Divider style={{ background: "white" }} light />

              {/* CONTENT CARD */}
              <Card
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
                sx={{
                  display: "flex",
                  color: "white",
                  background: "transparent",

                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{ marginBottom: "20px" }}
                        component="div"
                        variant="h2"
                      >
                        {Temp.number}
                      </Typography>
                      <img src={Temp.icon}></img>
                    </div>
                    <Typography style={{ display: "flex" }} variant="h5">
                      {t(Temp.description)}
                    </Typography>
                  </CardContent>

                  <Typography
                    style={{
                      fontSize: "17px",
                      marginLeft: "7px",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                    component="div"
                  >
                    {t("min")} : {Temp.min} | {t("max")} : {Temp.max}
                  </Typography>
                </Box>

                <CardMedia
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  sx={{ height: "240px" }}
                >
                  <CloudIcon style={{ fontSize: "200px" }} />
                </CardMedia>
              </Card>
              {/* ===== CONTENT CARD ====== */}
            </CardContent>
            <CardActions>
              <Button
                style={{ color: "white" }}
                size="small"
                onClick={handleLanguageClick}
              >
                {Language}
              </Button>
            </CardActions>
          </Card>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
