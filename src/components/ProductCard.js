import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProductCard({
  item,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>

      <Text style={styles.price}>
        Price: ${item.list_price}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    marginTop: 5,
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  editButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});