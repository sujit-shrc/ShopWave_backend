const express = require("express");
const app = express();
const auth_admin = require("./middleware/auth_admin")
const userRoutes = require("./routes/user/index")
const merchantRoutes = require("./routes/merchant/merchant")


// Middlewares
app.use(express.json());

 

app.get("/", (req, res) => {
  res.status(200).json({ message: "successfull" });
});


app.get('/test', auth_admin, (req, res) => {
  res.status(200).send({"message": "/test endpoint test endpoint"})
})

app.use('/user', userRoutes);
app.use('/api/products', merchantRoutes)

module.exports = app;
