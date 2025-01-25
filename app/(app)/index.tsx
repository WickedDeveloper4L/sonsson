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
import { Audio } from "expo-av";
export default function Index() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const animation = useRef<LottieView>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  async function startRecording() {
    try {
      if (!permissionResponse || permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setIsRecording(true);
      setRecording(recording);
      console.log("Recording started");
      // Start updating the recording duration
      intervalRef.current = setInterval(() => {
        recording.getStatusAsync().then((status) => {
          if (status.isRecording) {
            setRecordingDuration(status.durationMillis);
          }
        });
      }, 1000);
    } catch (err) {
      setIsRecording(false);
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }
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
        <TouchableOpacity onPress={stopRecording}>
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
        <TouchableOpacity onPress={startRecording}>
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
      {isRecording && (
        <Text style={styles.time}>{`${Math.floor(
          recordingDuration / 1000
        )}s`}</Text>
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
  time: {
    fontSize: 35,
    fontWeight: "700",
    color: "#fff",
  },
});
