import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import {
  createProduct,
  getCategories,
} from "../api/odoo";

export default function AddProductScreen({
  route,
  navigation,
}) {

  const uid = route?.params?.uid;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [defaultCode, setDefaultCode] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {

    try {

      const data = await getCategories(uid);

      setCategories(data);

      if (data.length > 0) {
        setCategoryId(
          data[0].id.toString()
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  const handleAdd = async () => {

    try {

      const productData = {

        name,

        list_price: parseFloat(price),

        barcode,

        default_code: defaultCode,

        description_sale: description,

        categ_id: parseInt(categoryId),

        type: "product",
      };

      console.log(
        "ADDING PRODUCT:",
        productData
      );

      await createProduct(
        uid,
        productData
      );

      Alert.alert(
        "Success",
        "Product added successfully"
      );

      navigation.goBack();

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Failed to add product"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Add Product
      </Text>

      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Price"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Barcode"
        style={styles.input}
        value={barcode}
        onChangeText={setBarcode}
      />

      <TextInput
        placeholder="Internal Reference"
        style={styles.input}
        value={defaultCode}
        onChangeText={setDefaultCode}
      />

      <TextInput
        placeholder="Quantity"
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Description"
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>
        Category ID
      </Text>

      <TextInput
        placeholder="Category ID"
        style={styles.input}
        value={categoryId}
        onChangeText={setCategoryId}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>
          Save Product
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

});