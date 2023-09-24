const polls = require("../../config/db");

const getProducts = async (req, res) => {
  // Check if the user is authenticated and has the "right" role
  if (req.user && req.user.user_role === "Admin") {
    try {
      // Insert the new product into the database
      const query = "SELECT * FROM products  WHERE merchant_id = ?";
      const values = [req.user.user_id];
      polls.query(query, values, (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(201).json({ products: result });
      });
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // User is not authorized to add products
    res
      .status(403)
      .json({ message: "You are not authorized to get your products." });
  }
};

const addProduct = async (req, res) => {
  // Check if the user is authenticated and has the "Merchant" role
  if (req.user && req.user.user_role === "Admin") {
    try {
      const {
        product_name,
        description,
        selling_price,
        discount,
        stock_quantity,
        category_id,
        main_image_url,
      } = req.body;

      // Check if any required field is missing
      if (
        !product_name ||
        !description ||
        !selling_price ||
        !stock_quantity ||
        !category_id ||
        !main_image_url
      ) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const { user_id } = req.user;

      const query =
        "INSERT INTO products (merchant_id, product_name, description, selling_price, discount, stock_quantity, category_id, main_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      const values = [
        user_id, // Merchant id
        product_name,
        description,
        selling_price,
        discount,
        stock_quantity,
        category_id,
        main_image_url,
      ];

      // Insert the new product into the database
      polls.query(query, values, (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        // Return the newly inserted product ID
        res.status(201).json({ productId: result.insertId });
      });
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // User is not authorized to add products
    res
      .status(403)
      .json({ message: "You are not authorized to add products." });
  }
};

const updateProduct = async (req, res) => {
  // Checking if the user is authenticated and has the "Merchant" role
  if (req.user && req.user.user_role === "Admin") {
    try {
      const productId = req.params.productId;
      const {
        product_name,
        description,
        selling_price,
        discount,
        stock_quantity,
        category_id,
        main_image_url,
      } = req.body;

      const { user_id } = req.user;

      const query =
        "UPDATE products SET product_name = ?, description = ?, selling_price = ?, discount = ?, stock_quantity = ?, category_id = ?, main_image_url = ? WHERE product_id = ? AND merchant_id = ?";

      const values = [
        product_name,
        description,
        selling_price,
        discount,
        stock_quantity,
        category_id,
        main_image_url,
        productId,
        user_id, // Merchant id
      ];

      // Update the product in the database
      polls.query(query, values, (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        // Check if the product was updated successfully
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Product updated successfully" });
        } else {
          res.status(404).json({
            message:
              "Product not found or you are not authorized to update it.",
          });
        }
      });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // User is not authorized to update products
    res
      .status(403)
      .json({ message: "You are not authorized to update products." });
  }
};

const deleteProduct = async (req, res) => {
  // Check if the user is authenticated and has the "Merchant" role
  if (req.user && req.user.user_role === "Admin") {
    try {
      const productId = req.params.productId;

      const query =
        "DELETE FROM products WHERE product_id = ? AND merchant_id = ?";
      const values = [productId, req.user.user_id];
      // Delete the product from the database
      polls.query(query, values, (err, result) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        // Check if the product was deleted successfully
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Product deleted successfully" });
        } else {
          res.status(404).json({
            message:
              "Product not found or you are not authorized to delete it.",
          });
        }
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // User is not authorized to delete products
    res
      .status(403)
      .json({ message: "You are not authorized to delete products." });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
