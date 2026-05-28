import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
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

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    const userId = await login();

    setUid(userId);

    const data = await getProducts(userId);

    setProducts(data);
  };

  const handleDelete = async (id) => {
    await deleteProduct(uid, id);

    loadProducts();
  };

  return (
    <View style={styles.container}>
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

      <FlatList
        data={products}
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
      />
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
});