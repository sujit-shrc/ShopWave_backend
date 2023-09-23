const pool = require("../config/db");

const auth_admin = (req, res, next) => {
  const query =
    "select role from role where roleid=(select roleid from special_table where userid =(select user_id from sessions  where session_id=2))";
  //const query = "select roleid from special_table where userid =(select userid from sessions  where session_id=1)";

  pool.query(query, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    if (results[0].role === "Admin") {
      next();
    } else {
      return res.status(403).send("unauthorized");
    }
  });
};

module.exports = auth_admin;
