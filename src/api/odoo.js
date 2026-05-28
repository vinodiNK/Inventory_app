import axios from "axios";

// ======================
// ODOO CONFIG
// ======================

// Replace with your Odoo server URL
// Example:
// Local PC: http://192.168.1.10:8069
// Android Emulator: http://10.0.2.2:8069

const ODOO_URL = "http://192.168.172.174:8069";

// Your Odoo credentials
const DB_NAME = "admin18odoo";
const USERNAME = "admin";
const PASSWORD = "admin18odoo";

// Configure axios
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = false;

// ======================
// LOGIN
// ======================

export const login = async () => {
  try {
    console.log("LOGIN START");

    const response = await axios.post(
      `${ODOO_URL}/jsonrpc`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "common",
          method: "login",
          args: [
            DB_NAME,
            USERNAME,
            PASSWORD,
          ],
        },
        id: Math.random(),
      }
    );

    console.log("LOGIN RESPONSE:", response.data);

    return response.data.result;

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error.response?.data || error.message
    );
  }
};

// ======================
// GET PRODUCTS
// ======================

export const getProducts = async (uid) => {
  try {

    console.log("GET PRODUCTS START");

    const response = await axios.post(
      `${ODOO_URL}/jsonrpc`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            DB_NAME,
            uid,
            PASSWORD,
            "product.template",
            "search_read",
            [[]],
            {
              fields: [
                "id",
                "name",
                "list_price",
              ],
            },
          ],
        },
        id: Math.random(),
      }
    );

    console.log(
      "GET PRODUCTS RESPONSE:",
      response.data
    );

    return response.data.result;

  } catch (error) {

    console.log(
      "GET PRODUCTS ERROR:",
      error.response?.data || error.message
    );
  }
};

// ======================
// CREATE PRODUCT
// ======================

export const createProduct = async (
  uid,
  product
) => {
  try {

    console.log("CREATE PRODUCT START");

    const response = await axios.post(
      `${ODOO_URL}/jsonrpc`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            DB_NAME,
            uid,
            PASSWORD,
            "product.template",
            "create",
            [
              {
                name: product.name,

                list_price: parseFloat(
                  product.price
                ),

                type: "consu",
              },
            ],
          ],
        },
        id: Math.random(),
      }
    );

    console.log(
      "CREATE PRODUCT RESPONSE:",
      response.data
    );

    return response.data.result;

  } catch (error) {

    console.log(
      "CREATE PRODUCT ERROR:",
      error.response?.data || error.message
    );
  }
};

// ======================
// UPDATE PRODUCT
// ======================

export const updateProduct = async (
  uid,
  id,
  product
) => {
  try {

    console.log("UPDATE PRODUCT START");

    const response = await axios.post(
      `${ODOO_URL}/jsonrpc`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            DB_NAME,
            uid,
            PASSWORD,
            "product.template",
            "write",
            [
              [id],
              {
                name: product.name,

                list_price: parseFloat(
                  product.price
                ),
              },
            ],
          ],
        },
        id: Math.random(),
      }
    );

    console.log(
      "UPDATE PRODUCT RESPONSE:",
      response.data
    );

    return response.data.result;

  } catch (error) {

    console.log(
      "UPDATE PRODUCT ERROR:",
      error.response?.data || error.message
    );
  }
};

// ======================
// DELETE PRODUCT
// ======================

export const deleteProduct = async (
  uid,
  id
) => {
  try {

    console.log("DELETE PRODUCT START");

    const response = await axios.post(
      `${ODOO_URL}/jsonrpc`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            DB_NAME,
            uid,
            PASSWORD,
            "product.template",
            "unlink",
            [[id]],
          ],
        },
        id: Math.random(),
      }
    );

    console.log(
      "DELETE PRODUCT RESPONSE:",
      response.data
    );

    return response.data.result;

  } catch (error) {

    console.log(
      "DELETE PRODUCT ERROR:",
      error.response?.data || error.message
    );
  }
};