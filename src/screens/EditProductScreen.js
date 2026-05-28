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

  // STATES
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

  const [categoryId, setCategoryId] =
    useState(
      product?.categ_id?.[0]?.toString() ??
        ""
    );

  const [categories, setCategories] =
    useState([]);

  // LOAD CATEGORIES
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

  // UPDATE PRODUCT
  const handleUpdate = async () => {

    try {

      const updatedData = {

        name: name,

        // IMPORTANT FIX
        list_price: Number(price),

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

      {/* PRODUCT NAME */}
      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* PRICE */}
      <TextInput
        placeholder="Price"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* BARCODE */}
      <TextInput
        placeholder="Barcode"
        style={styles.input}
        value={barcode}
        onChangeText={setBarcode}
      />

      {/* INTERNAL REFERENCE */}
      <TextInput
        placeholder="Internal Reference"
        style={styles.input}
        value={defaultCode}
        onChangeText={setDefaultCode}
      />

      {/* DESCRIPTION */}
      <TextInput
        placeholder="Description"
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
        value={description}
        onChangeText={
          setDescription
        }
      />

      {/* CATEGORY */}
      <Text style={styles.label}>
        Category ID
      </Text>

      <TextInput
        placeholder="Category ID"
        style={styles.input}
        value={categoryId}
        onChangeText={
          setCategoryId
        }
        keyboardType="numeric"
      />

      {/* UPDATE BUTTON */}
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