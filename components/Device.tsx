import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface Props {
  data: any;
}

const Device: React.FC<Props> = (props) => (
  <View style={styles.screen}>
    <LinearGradient
      colors={["#EAA9A9", "#000000", "#514E4E", "#000000"]}
      locations={[0, 0.5, 0.75, 1]}
      style={styles.background}
    ></LinearGradient>
  </View>
);

Device.defaultProps = {};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("screen").height,
  },
});

export default Device;
