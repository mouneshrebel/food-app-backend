const userModel = require("../models/UserData");
const router = require("express").Router();
const userProduct = require("../models/product");
const ContactSchema = require("../models/ContactData");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      res.send({ message: "Email  is already registered", alert: false , status : 300});
    } else {
      const data = new userModel(req.body);
      const saveResult = await data.save();
      res.send({ message: "Successfully signed up", alert: true, status : 200 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "An error occurred", alert: false });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userModel.findOne({ email: email });

    if (!result) {
      // User with this email does not exist
      return res.status(401).json({
        message: "Email is not available, please sign up",
        status: 401,
        alert: false,
      });
    }

    // Compare the user input password with the password stored in the database
    if (result.password !== password) {
      // Password is wrong
      return res.status(401).json({
        status: 401,
        message: "Password is wrong",
      });
    }

    // If passwords match, create a user data object to send back to the client
    const Send = {
      _id: result._id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      image: result.image,
    };

    res.status(200).json({
      status: 200,
      message: "Login Successfully",
      alert: true,
      data: Send,
    });
    console.log(Send);
  } catch (error) {
    console.error(error);
    res.status(501).json({ message: "Server error", status: 501 });
  }
});

router.post("/uploadProduct", async (req, res) => {
  console.log(req.body);

  const newUser = new userProduct({
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
  });
  try {
    await newUser.save();
    res
      .status(200)
      .json({ message: "upload successfully", status: 200, alert: true });
  } catch (err) {}
});

router.get("/product", async (req, res) => {
  const data = await userProduct.find({});
  res.send(JSON.stringify(data));
});

router.get("/:_id", async (req, res) => {
  const _id = req.params._id;

  try {
    const data = await userProduct.findOne({ _id: _id });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: "Id id not available" });
  }
});

router.delete("/:_id", async (req, res) => {
  const _id = req.params._id;

  try {
    await userProduct.findOneAndDelete({
      _id: _id,
    });
    res.status(200).json({ _id: _id, message: "Data has been deleted" });
  } catch (err) {
    res.status(400).json({ message: "something is occurred" });
  }
});

router.post("/payment", async (req, res) => {
  const { overallTotal, token, TotalCartMap } = req.body;

  // Extract item names from the TotalCartMap array
  const itemNames = TotalCartMap.map((item) => item.name).join(", ");

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: overallTotal * 100,
      currency: "inr",
      customer: customer.id,
      receipt_email: token.email,
      payment_method: "pm_card_visa",
      description: `Payment for: ${itemNames}`,
    });

    res.status(200).json({ message: "payment done", status: 200 });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(400).json({ message: "server error", status: 400 });
  }
});

router.post("/contactData", async (req, res) => {

  const newContact = new ContactSchema({
    name : req.body.name,
    email : req.body.email,
    message : req.body.message
  });

  try{
     await newContact.save();
     res.status(200).json({message: "Submitted", status : 200})
  }catch(err){
    res.status(400).json({message : "Server Error", status : 400})
  }
});

module.exports = router;
