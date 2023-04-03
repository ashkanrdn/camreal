import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
  },
});

const FlashToggleButton = ({ cameraRef }) => {
  const [flashOn, setFlashOn] = useState(false);

  const toggleFlash = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setFlashOn(!flashOn);
      cameraRef.current.setFlashMode(flashOn ? "off" : "on");
    } else {
      alert("Camera permission not granted");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleFlash}>
      <Text style={styles.text}>{flashOn ? "OFF" : "ON"}</Text>
    </TouchableOpacity>
  );
};

export default FlashToggleButton;
