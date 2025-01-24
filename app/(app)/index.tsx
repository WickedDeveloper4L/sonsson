import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
export default function Index() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const animation = useRef<LottieView>(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {isRecording ? (
        <Text style={styles.heading}>Tap to stop</Text>
      ) : (
        <Text style={styles.heading}>Tap to Record</Text>
      )}
      {isRecording ? (
        <TouchableOpacity onPress={() => setIsRecording(!isRecording)}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 400,
              height: 400,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../assets/animation/recording.json")}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setIsRecording(!isRecording)}>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 400,
              height: 400,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../assets/animation/start.json")}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  heading: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
