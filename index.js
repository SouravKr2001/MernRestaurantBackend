const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5500;

app.use(cors());

//use express.json() to get data into json format
app.use(express.json({ limit: "10mb" }));

//mongodb connection

mongoose
  .connect(process.env.MOGODB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//schema

const userSchema = mongoose.Schema({
  image: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
});

//model
const userModel = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("running server");
});

//signup
app.post("/signup", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }).then(async (result) => {
    console.log(result);
    if (result) {
      res.send({ message: "Email id is Already registered", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully Registered", alert: true });
    }
  });
});

//login
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }).then(async (result) => {
    console.log(result);
    if (result) {
      const dataSend = {
        _id: result._id,
        image: result.image,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      };

      console.log(dataSend);

      res.send({
        message: "Login is Successfully ",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Email id is not registered, please SignUp",
        alert: false,
      });
    }
  });
});

//product section

const schemaProduct = mongoose.Schema({
  image: String,
  name: String,
  category: String,
  price: String,
  description: String,
});

const productModel = mongoose.model("product", schemaProduct);

//api to save new product
app.post("/uploadProduct", async (req, res) => {
  console.log(req.body);
  const data = await productModel(req.body);
  const dataSave = await data.save();
  res.send({ message: "upload Successfully" });
});

//api to get all products

app.get("/products",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})

//add port and connect to server
app.listen(PORT, () => console.log("Server connected"));
