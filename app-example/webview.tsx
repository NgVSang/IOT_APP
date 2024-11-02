import React from "react";
import Constants from "expo-constants";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const webview: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* <WebView
        originWhitelist={["*"]}
        style={styles.container}
        source={{ uri: "https://expo.dev" }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

export default webview;
