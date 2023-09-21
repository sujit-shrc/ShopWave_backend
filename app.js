const express = require("express");
const app = express();
const pool=require('./config/db')     


app.post("/", (req, res) => {
  const query = "select role from role where roleid=(select roleid from special_table where userid =(select user_id from sessions  where session_id=2))";
  //const query = "select roleid from special_table where userid =(select userid from sessions  where session_id=1)";
    
   

  pool.query(query, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ "success": false, message: error.message });
    }


    // Process the results as needed
    return res.status(201).json({ "success": true, results});
  });
});

 






app.get("/", (req, res) => {
  res.status(200).json({ message: "successfull" });
});

module.exports = app;
