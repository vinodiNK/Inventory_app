import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

// Odoo Server URL
const ODOO_URL = "http://192.168.172.174:8069";

// Odoo Credentials
const DB_NAME = "admin18odoo";
const USERNAME = "admin";
const PASSWORD = "admin18odoo";

export default function HomeScreen({ navigation, route }) {
  const uid = route?.params?.uid;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products from Odoo
  const fetchProducts = async () => {
    try {
      // Step 1 - Login
      const loginResponse = await fetch(
        `${ODOO_URL}/web/session/authenticate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
              db: DB_NAME,
              login: USERNAME,
              password: PASSWORD,
            },
          }),
        }
      );

      const loginData = await loginResponse.json();

      if (!loginData.result || !loginData.result.uid) {
        console.log("Login Failed");
        return;
      }

      // Step 2 - Fetch Products
      const productResponse = await fetch(
        `${ODOO_URL}/web/dataset/call_kw/product.product/search_read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            params: {
              model: "product.product",
              method: "search_read",
              args: [],
              kwargs: {
                domain: [],
                fields: [
                  "id",
                  "name",
                  "list_price",
                  "qty_available",
                  "default_code",
                ],
                limit: 100,
              },
            },
          }),
        }
      );

      const productData = await productResponse.json();

      if (productData.result) {
        setProducts(productData.result);
      } else {
        console.log("No Products Found");
      }
    } catch (error) {
      console.log("Error Fetching Products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Product Item UI
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>

      <Text style={styles.productText}>
        Code: {item.default_code || "N/A"}
      </Text>

      <Text style={styles.productText}>
        Price: Rs. {item.list_price}
      </Text>

      <Text style={styles.productText}>
        Available Qty: {item.qty_available}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Odoo Inventory</Text>

      <Text style={styles.subtitle}>
        Product List from Odoo Database
      </Text>

      {/* Product List */}
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Footer Navigation */}
      <View style={styles.footer}>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#555" />
          <Text style={styles.footerText}>Back</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={24} color="green" />
          <Text style={[styles.footerText, { color: "green" }]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Product Button */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() =>
            navigation.navigate("Products", {
              uid,
            })
          }
        >
          <Ionicons name="cube" size={24} color="#555" />
          <Text style={styles.footerText}>Products</Text>
        </TouchableOpacity>

        {/* Account Button */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Account")}
        >
          <Ionicons name="person" size={24} color="#555" />
          <Text style={styles.footerText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    paddingTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  productCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },

  productText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },

  /* Footer Styles */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 10,
    paddingBottom: 5,
  },

  footerItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  footerText: {
    fontSize: 12,
    marginTop: 3,
    color: "#555",
  },

  /* Center Add Button */
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25,
    elevation: 5,
  },
});