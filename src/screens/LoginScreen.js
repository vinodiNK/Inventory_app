import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { getUserRole, login } from "../api/odoo";

export default function LoginScreen({
  navigation,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async () => {
    const uid = await login(
      email,
      password
    );

    if (uid) {
      const userRole =
        await getUserRole(uid);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >

        {/* Background Circle */}
        <View style={styles.topCircle} />

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="cube"
              size={60}
              color="#16a34a"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Odoo Inventory
        </Text>

        <Text style={styles.subtitle}>
          Login to continue to your
          account
        </Text>

        {/* Card */}
        <View style={styles.card}>

          {/* Email */}
          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="mail-outline"
              size={24}
              color="#16a34a"
            />

            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#16a34a"
            />

            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={
                !showPassword
              }
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={24}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text
              style={styles.buttonText}
            >
              Login
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#16a34a"
            />

            <Text
              style={styles.footerText}
            >
              Secure and trusted access
            </Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f5",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#f4f6f5",
  },

  topCircle: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor:
      "rgba(22,163,74,0.08)",
    top: -80,
    left: -80,
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor:
      "rgba(22,163,74,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111",
  },

  subtitle: {
    fontSize: 17,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 35,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  label: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 5,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    paddingHorizontal: 18,
    height: 65,
    backgroundColor: "#fff",
    marginBottom: 22,
  },

  input: {
    flex: 1,
    marginLeft: 14,
    fontSize: 17,
    color: "#111827",
  },

  button: {
    backgroundColor: "#16a34a",
    height: 62,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,

    shadowColor: "#16a34a",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  footerText: {
    marginLeft: 8,
    color: "#6b7280",
    fontSize: 15,
  },
});