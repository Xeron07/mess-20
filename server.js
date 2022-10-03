require("dotenv").config();
require("./config/db").connect();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 7001;

///middlewear
const auth = require("./middleware/auth");

///routes

const UserRoutes = require("./routes/user");
const MealRoutes = require("./routes/meal");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/user", UserRoutes);
app.use("/meal", auth, MealRoutes);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
