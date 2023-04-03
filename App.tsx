import { StyleSheet, View } from "react-native";
import { NativeBaseProvider } from "native-base";

import CameraComp from "./src/components/cameraComp";
export default function App() {
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <CameraComp />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
});
