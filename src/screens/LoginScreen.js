import { useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getUserRole, login } from "../api/odoo";

export default function LoginScreen({
  navigation,
}) {
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    const uid = await login(
      email,
      password
    );

    if (uid) {
      const userRole = await getUserRole(uid);
      
      navigation.replace(
        "Home",
        {
          uid,
          isAdmin: userRole.isAdmin,
        }
      );
    } else {
      Alert.alert(
        "Login Failed",
        "Invalid credentials"
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Odoo Inventory Login
      </Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});