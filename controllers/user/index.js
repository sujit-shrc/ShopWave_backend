const poll = require("../../config/db");
const bcrypt = require('bcrypt')
const randomstring = require("randomstring");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);
    // Hashing the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the username already exists in the database
    const query = "SELECT * FROM users WHERE email = ?";

    const values = [email];
    poll.query(query, values, (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    //   Check if user exists
      if (results.length > 0) {
        return res.status(400).json({ message: "Accout already exists" });
      }

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      const values = [username, email, hashedPassword];
      poll.query(insertQuery, values, (err) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        console.log("user Created successfylly--------------------");
        return res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
const { token } = req.body
    if(token){
      const query = 'select username, email from users where id = (select user_id from sessions where session_id = ?)'
      const values = [token]
      poll.query(query, values, (err, result) => {
        if(err){
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(200).send(result)
      })
    }
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const query = "SELECT * FROM users WHERE email = ?";
    const values = [email];
    poll.query(query, values, async (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      const user = results[0]; // Extracting the User from results
      const userId = user.id;
      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      // Generate a token upon successful login
      const token = randomstring.generate({
        length: 12,
        charset: 'alphanumeric'
      });

     // Save user token in session table
     console.log(userId, token)
    const query = 'INSERT INTO sessions (user_id, session_id) VALUES (?, ?)';
    const values = [userId, token]
    poll.query(query, values, (err, results)=>{
        if(err){
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    })
      return res.status(200).json({ message: "Login successful", token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const profile = (req,res) => {
    const {token} = req.body;
    try {
      // trying if token exists then we will proceed
      if(token){
        const query = "select username, email from users where id =  (select user_id from sessions where session_id = ?)"
        const values = [token];
        poll.query(query, values, (err, results) =>{
            if(err){
                return res.status(500).send(err)
            }
            return res.status(200).send({"user": results})
        })
    }
    } catch (error) {
      return res.status(500).send({"message": "Access Denied"})
    }
}

module.exports = {
    login,
    register,
    profile,
  }
