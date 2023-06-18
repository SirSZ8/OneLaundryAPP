import { StyleSheet } from "react-native";
import { FAS } from "react-native-paper";

function WidgetBaseFABCreate({ action, disabled, icon }) {
  return (
    <FAS
      disabled={disabled}
      style={styles.fab}
      icon={icon || "fa-list"}
      onPress={() => action()}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 10,
    right: 0,
    bottom: 0,
  },
});

export default WidgetBaseFABCreate;
