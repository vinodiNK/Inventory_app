import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getProducts, login } from "../api/odoo";

export default function ProductOverviewScreen({
  navigation,
  route,
}) {

  const routeUid =
    route?.params?.uid ?? null;
  const routeIsAdmin = route?.params?.isAdmin ?? false;

  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState(routeUid);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(routeIsAdmin);

  
  const loadProducts = async (userId) => {
    try {
      setLoading(true);

      const currentUid =
        userId ??
        uid ??
        (await login()) ??
        null;

      setUid(currentUid);

      const data = await getProducts(currentUid);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("ProductOverview load error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (routeUid)
      loadProducts(routeUid);

    else loadProducts();

  }, [routeUid]);

  useEffect(() => {
    setIsAdmin(routeIsAdmin);
  }, [routeIsAdmin]);

  const productArray = Array.isArray(products) ? products : [];


  const totalProducts = productArray.length;

  
  const totalStockValue = productArray.reduce(
    (sum, item) => sum + (item.list_price || 0) * (item.qty_available || 0),
    0
  );

  
  const totalQuantity = productArray.reduce(
    (sum, item) => sum + (item.qty_available || 0),
    0
  );


  const highestPrice =
    productArray.length > 0
      ? Math.max(...productArray.map((p) => p.list_price || 0))
      : 0;

  
  const lowestPrice =
    productArray.length > 0
      ? Math.min(...productArray.map((p) => p.list_price || 0))
      : 0;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Product Overview
      </Text>

    

      <View style={styles.summaryContainer}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Total Products
          </Text>

          <Text style={styles.cardValue}>
            {totalProducts}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Total Quantity
          </Text>

          <Text style={styles.cardValue}>
            {totalQuantity}
          </Text>
        </View>

      </View>

      <View style={styles.summaryContainer}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Total Stock Value
          </Text>

          <Text style={styles.cardValue}>
            Rs.{" "}
            {totalStockValue.toFixed(2)}
          </Text>
        </View>

      </View>

      <View style={styles.summaryContainer}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Highest Price
          </Text>

          <Text style={styles.cardValue}>
            Rs.{" "}
            {highestPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Lowest Price
          </Text>

          <Text style={styles.cardValue}>
            Rs.{" "}
            {lowestPrice.toFixed(2)}
          </Text>
        </View>

      </View>

      {/* LOADING */}
      {loading ? (

        <ActivityIndicator
          size="large"
          color="green"
        />

      ) : (

        <FlatList
          data={productArray}
          keyExtractor={(item, index) =>
            item?.id != null
              ? item.id.toString()
              : index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.row}>

              <View>

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.smallText}>
                  Qty:{" "}
                  {item.qty_available ??
                    0}
                </Text>

              </View>

              <Text style={styles.price}>
                Rs.{" "}
                {item.list_price}
              </Text>

            </View>
          )}
        />

      )}

      
      <View style={styles.footer}>
        {isAdmin && (
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.icon}>🏠</Text>

            <Text style={[styles.footerText, { color: "green" }]}>Home</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddProduct", { uid: routeUid })}
          >
            <Text style={styles.addIcon}>＋</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() =>
            navigation.navigate("Home", {
              uid,
              isAdmin,
            })
          }
        >
          <Text style={styles.icon}>📦</Text>
          <Text style={styles.footerText}>Products</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  summaryContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 15,
  },

  card: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  smallText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },

  footer: {
    position: "absolute",
    bottom: 38,
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

  icon: {
    fontSize: 24,
  },

  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
    elevation: 1,
  },

  addIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },

});