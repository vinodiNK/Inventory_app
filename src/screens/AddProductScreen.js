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

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
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
    setNameError("");
    setPriceError("");

    const trimmedName = name.trim();
    const trimmedPrice = price.trim();

    let hasError = false;

    if (!trimmedName) {
      setNameError("Product name is required");
      hasError = true;
    }

    if (!trimmedPrice) {
      setPriceError("Price is required");
      hasError = true;
    } else if (!/^[0-9]+$/.test(trimmedPrice)) {
      setPriceError("Price must be an integer value");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {

      const productData = {

        name: trimmedName,

        list_price: parseInt(trimmedPrice, 10),

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

      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        placeholder="Enter product name"
        style={styles.input}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) setNameError("");
        }}
      />
      {nameError ? (
        <Text style={styles.errorText}>{nameError}</Text>
      ) : null}

      <Text style={styles.label}>Price *</Text>
      <TextInput
        placeholder="Enter price"
        style={styles.input}
        value={price}
        onChangeText={(text) => {
          const sanitized = text.replace(/[^0-9]/g, "");
          setPrice(sanitized);
          if (priceError) setPriceError("");
        }}
        keyboardType="numeric"
      />
      {priceError ? (
        <Text style={styles.errorText}>{priceError}</Text>
      ) : null}


      <Text style={styles.label}>Barcode</Text>
      <TextInput
        placeholder="Enter barcode"
        style={styles.input}
        value={barcode}
        onChangeText={setBarcode}
      />

      <Text style={styles.label}>Internal Reference</Text>
      <TextInput
        placeholder="Enter internal reference"
        style={styles.input}
        value={defaultCode}
        onChangeText={setDefaultCode}
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        placeholder="Enter quantity"
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="Enter description"
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category ID</Text>
      <TextInput
        placeholder="Enter category ID"
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
    marginBottom: 40,
    marginTop: 40,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 13,
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
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