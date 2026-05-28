import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { getProducts, login } from "../api/odoo";

export default function ProductOverviewScreen({ route }) {
  const routeUid = route?.params?.uid ?? null;
  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState(routeUid);
  const [loading, setLoading] = useState(true);

  const loadProducts = async (userId) => {
    try {
      setLoading(true);
      const currentUid = userId ?? uid ?? (await login());
      setUid(currentUid);

      const data = await getProducts(currentUid);
      setProducts(data || []);
    } catch (error) {
      console.log("ProductOverview load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeUid) loadProducts(routeUid);
    else loadProducts();
  }, [routeUid]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Overview</Text>

      <Text style={styles.count}>Total products: {products.length}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>Rs. {item.list_price}</Text>
            </View>
          )}
        />
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  count: {
    textAlign: "center",
    color: "#666",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
});