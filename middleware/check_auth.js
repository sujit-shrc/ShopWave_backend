const pool = require("../config/db");

const check_auth = (req, res, next) => {
  //   const query =
  //     "select role, ro from role where roleid=(select roleid from special_table where userid =(select user_id from sessions  where session_id = ? ))";
  const query =
    "SELECT role.role AS user_role, sessions.user_id AS session_user_id FROM role JOIN special_table ON role.roleid = special_table.roleid JOIN sessions ON special_table.userid = sessions.user_id WHERE sessions.session_id = ?";

  const values = ["1zB6HQLT9AlN"];

  pool.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    if (results[0].user_role === "Admin") {
        const data = {
            user_role: results[0].user_role,
            user_id: results[0].session_user_id
        };
        req.user = data
        console.log(data)        
      next();
    } else {
      return res.status(403).send("unauthorized");
    }
  });
};

module.exports = check_auth;

// require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const SECRET_KEY = process.env.JWT_TOKEN

// const checkAuthToken = (req, res, next) => {
//   if (!req.header("Authorization")) return res.status(401).json({ message: "Unauthorized" });

//   const token = req.header("Authorization").split(" ")[1];
//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.status(403).json({ message: "Forbidden" });
//     req.user = user;
//     next();
//   });
// };

// module.exports = checkAuthToken
