import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import QRCode from "react-native-qrcode-svg";
import { Box, NativeBaseProvider, Button, VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function CameraComp() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [type, setType] = useState(CameraType.back);
  const [flashIcon, setFlashIcon] = useState("flash-off");
  const [flashType, setFlashType] = useState(FlashMode.off);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const toggleCameraType = () => {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const toggleFlashType = () => {
    setFlashType((current) => (current === FlashMode.off ? FlashMode.on : FlashMode.off));
    setFlashIcon((current) => (current === "flash-off" ? "flash-on" : "flash-off"));
  };
  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    console.log(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          <VStack>
            <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
            <Button title='Share' onPress={sharePic}>
              Share
            </Button>
            {hasMediaLibraryPermission ? (
              <Button title='Save' onPress={savePhoto}>
                Save
              </Button>
            ) : undefined}
            <Button title='Discard' onPress={() => setPhoto(undefined)}>
              Discard
            </Button>
          </VStack>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Camera style={styles.preview} ref={cameraRef} type={type} flashMode={flashType}>
          {/* <View style={styles.captureContainer}> */}
          {/* <TouchableOpacity style={styles.pickImageButton} onPress={pickImage} />
            <TouchableOpacity style={styles.captureButton} onPress={takePic} />

            <TouchableOpacity style={styles.profileButton} /> */}

          {/* <TouchableOpacity style={styles.flipCamera} onPress={toggleCameraType}>
              <MaterialIcons name='flip-camera-ios' size={60} color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipCamera} onPress={toggleFlashType}>
              <MaterialIcons name={flashIcon} size={60} color='black' />
            </TouchableOpacity> */}
          {/* </View> */}
        </Camera>
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
    alignItems: "center",
  },
  pickImageButton: {
    width: 48,
    height: 48,

    backgroundColor: "red",
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "blue",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: " ",
  },
  captureContainer: {
    width: "100%",
    flex: 1,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    marginBottom: 60,
    flexDirection: "row",

    justifyContent: "space-around",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "#333333",
    borderWidth: 3,
    backgroundColor: "#FFFFFF",
  },
  flipCamera: {
    width: 80,
    height: 80,
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  flipCameraIcon: {
    flex: 1,

    backgroundColor: "#454545",
  },
});
