import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddProductScreen from "../screens/AddProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import ProductListScreen from "../screens/ProductListScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Products"
          component={ProductListScreen}
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