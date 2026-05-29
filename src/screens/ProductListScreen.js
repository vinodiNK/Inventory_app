import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import {
  deleteProduct,
  getProducts,
  login,
} from "../api/odoo";

import ProductCard from "../components/ProductCard";

export default function ProductListScreen({ navigation, route }) {
  const routeUid = route?.params?.uid ?? null;
  const routeIsAdmin = route?.params?.isAdmin ?? false;
  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState(routeUid);
  const [isAdmin, setIsAdmin] = useState(routeIsAdmin);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (routeUid) {
      setUid(routeUid);
      setIsAdmin(routeIsAdmin);
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

  const loadProducts = async (userId) => {
    try {
      const currentUid = userId ?? uid ?? (await login());
      setUid(currentUid);

      const data = await getProducts(currentUid);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("ProductList load error:", error);
      setProducts([]);
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(uid, id);

    loadProducts(uid);
  };

  
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {isAdmin && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddProduct", {
              uid,
            })
          }
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}

    
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onEdit={() =>
              navigation.navigate("EditProduct", {
                uid,
                product: item,
              })
            }
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      
      <View style={styles.footer}>
        {isAdmin && (
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate("Home", { uid, isAdmin })}
          >
            <Text style={styles.icon}>🏠</Text>
            <Text style={[styles.footerText, { color: "green" }]}>Home</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <TouchableOpacity
            style={styles.addButtonFooter}
            onPress={() =>
              navigation.navigate("AddProduct", {
                uid,
              })
            }
          >
            <Text style={styles.addIcon}>＋</Text>
          </TouchableOpacity>
        )}

        {isAdmin && (
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() =>
              navigation.navigate("ProductOverview", {
                uid,
                isAdmin,
              })
            }
          >
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.footerText}>Overview</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f2f2",
  },

  addButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  searchBar: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },

  footer: {
    position: "absolute",
    bottom: 33,
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

  addButtonFooter: {
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