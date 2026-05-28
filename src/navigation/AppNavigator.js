import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddProductScreen from "../screens/AddProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductOverviewScreen from "../screens/ProductOverviewScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />

        <Stack.Screen
          name="Products"
          component={ProductListScreen}
          options={{ title: "Products" }}
        />

        <Stack.Screen
          name="ProductOverview"
          component={ProductOverviewScreen}
          options={{ title: "Product Overview" }}
        />

        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: "Add Product" }}
        />

        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{ title: "Edit Product" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}