import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { getCategories, updateProduct } from "../api/odoo";

export default function EditProductScreen({
  route,
  navigation,
}) {

  const uid = route?.params?.uid;
  const product = route?.params?.product;

  
  const [name, setName] = useState(
    product?.name ?? ""
  );

  const [price, setPrice] = useState(
    product?.list_price?.toString() ?? ""
  );

  const [barcode, setBarcode] = useState(
    product?.barcode ?? ""
  );

  const [defaultCode, setDefaultCode] =
    useState(
      product?.default_code ?? ""
    );

  const [description, setDescription] =
    useState(
      product?.description_sale ?? ""
    );

  const [quantity, setQuantity] = useState(
    product?.qty_available?.toString() ?? ""
  );

  const [categoryId, setCategoryId] =
    useState(
      product?.categ_id?.[0]?.toString() ??
        ""
    );

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [categories, setCategories] =
    useState([]);

  
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {

    try {

      const data =
        await getCategories(uid);

      setCategories(data);

      if (
        data.length > 0 &&
        !categoryId
      ) {
        setCategoryId(
          data[0].id.toString()
        );
      }

    } catch (error) {

      console.log(
        "CATEGORY ERROR:",
        error
      );
    }
  };

  
  const handleUpdate = async () => {
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

      const updatedData = {

        name: trimmedName,

        
        list_price: Number(trimmedPrice),

        barcode: barcode,

        default_code:
          defaultCode,

        description_sale:
          description,

        categ_id:
          Number(categoryId),
      };

      console.log(
        "UPDATED DATA:",
        updatedData
      );

      const result =
        await updateProduct(
          uid,
          product.id,
          updatedData
        );

      console.log(
        "UPDATE RESULT:",
        result
      );

      Alert.alert(
        "Success",
        "Product updated successfully"
      );

      navigation.goBack();

    } catch (error) {

      console.log(
        "UPDATE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to update product"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Edit Product
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
        placeholder="Quantity"
        style={styles.input}
        value={quantity}
        editable={false}
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
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>
          Update Product
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

  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "blue",
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