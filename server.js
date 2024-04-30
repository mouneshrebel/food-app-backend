const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/route");
const app = express();
dotenv.config();

const port = process.env.PORT || 4000;
const Db = process.env.DB_URL;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use(express.static("public"));

mongoose.connect(Db, { useNewUrlParser: true });

const connect = mongoose.connection; 

try {
  connect.on("open", () => {
    console.log("mongoose is connected!!!");
  });
} catch (err) {
  console.log(err, "Error");
}

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/users/", router);

app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
