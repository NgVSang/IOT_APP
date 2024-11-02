import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "@/navigation";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "detail">;

const Detail: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 30 }}> detail </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default Detail;
