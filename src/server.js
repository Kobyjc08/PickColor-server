const express = require("express");
const app = express();
const port = 5000;
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "multiplicadb",
  password: "",
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

app.post("/colors", function (req, res) {
  const { colorName, colorValue, colorPantone, yearCreate } = req.body;
  let query =
    "INSERT INTO colors ( colorname, colorvalue, colorpantone, yearcreate) VALUES ($1, $2, $3, $4)";
  pool
    .query(query, [colorName, colorValue, colorPantone, yearCreate])
    .then(() =>
      res.status(201).send({
        ok: true,
        message: "Color Created!!",
      })
    )
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "something went wrong...!",
        data: error,
      });
    });
});

app.get("/colors/:id", function (req, res) {
  const colorId = req.params.id;
  pool
    .query("select * from colors where id=$1;", [colorId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.get("/colors", function (req, res) {
  pool
    .query("select * from colors;")
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});

app.put("/colors/:id", function (req, res) {
  const colorId = req.params.id;
  const { colorName, colorValue, colorPantone, yearCreate } = req.body;
  let query =
    "update colors set colorname=$1, colorvalue=$2, colorpantone=$3, yearcreate=$4 where id=$5";
  pool
    .query(query, [colorName, colorValue, colorPantone, yearCreate, colorId])
    .then(() => res.status(201).send(`Color with ID: ${colorId} Updated!`))
    .catch((error) => {
      console.group(error);
      res.status(500).send("something went wrong!");
    });
});

app.delete("/colors/:id", function (req, res) {
  const colorId = req.params.id;
  let query = "delete from colors where id=$1";

  pool
    .query(query, [colorId])
    .then(() => res.status(201).send(`Color with ID: ${colorId} was Deleted`))
    .catch((error) => {
      console.log(error);
      res.status(500).send("something went wrong");
    });
});

app.listen(port, function () {
  console.log("Server is listening on port 5000. Ready to accept requests!");
});
