import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    deleteProduct,
    getProducts,
    login,
} from "../api/odoo";

import ProductCard from "../components/ProductCard";

export default function HomeScreen({ navigation, route }) {

  const routeUid = route?.params?.uid ?? null;

  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState(routeUid);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (routeUid) {
      setUid(routeUid);
      loadProducts(routeUid);
    } else {
      loadProducts();
    }
  }, [routeUid]);

  useFocusEffect(
    useCallback(() => {
      if (routeUid) {
        loadProducts(routeUid);
      } else {
        loadProducts();
      }
    }, [routeUid])
  );

  // Fetch Products from Odoo
  const loadProducts = async (userId) => {
    try {
      setLoading(true);
      const currentUid = userId ?? uid ?? (await login());
      setUid(currentUid);

      const data = await getProducts(currentUid);
      setProducts(data || []);

    } catch (error) {
      console.log("Error Fetching Products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteProduct(uid, product.id);
            setSelectedProductId(null);
            loadProducts(uid);
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    if (routeUid) {
      loadProducts(routeUid);
    } else {
      loadProducts();
    }
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>
        Odoo Inventory
      </Text>

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
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              isSelected={selectedProductId === item.id}
              onPress={() =>
                setSelectedProductId(
                  selectedProductId === item.id ? null : item.id
                )
              }
              onEdit={() =>
                navigation.navigate("EditProduct", {
                  uid,
                  product: item,
                })
              }
              onDelete={() => handleDelete(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.icon}>🏠</Text>

          <Text style={[styles.footerText, { color: "green" }]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddProduct", {
              uid,
            })
          }
        >
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>

        {/* Products Button */}
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() =>
            navigation.navigate("Home", {
              uid,
            })
          }
        >
          <Text style={styles.icon}>📦</Text>

          <Text style={styles.footerText}>
            Products
          </Text>
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
    marginTop: -25,
    elevation: 5,
  },

  addIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },

});