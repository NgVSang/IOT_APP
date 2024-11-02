import React, { FC, useCallback, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const home: FC = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Master Bedroom",
      device: [
        { id: 1, name: "Light", status: true },
        { id: 2, name: "Fan", status: false },
        { id: 3, name: "AC", status: true },
      ],
    },
    {
      id: 2,
      name: "Bedroom",
      device: [
        { id: 1, name: "Light", status: true },
        { id: 2, name: "Fan", status: false },
      ],
    },
    {
      id: 3,
      name: "Kids Room",
      device: [
        { id: 2, name: "Fan", status: false },
        { id: 3, name: "AC", status: true },
      ],
    },
    {
      id: 4,
      name: "Drawing Room",
      device: [
        { id: 1, name: "Light", status: false },
        { id: 2, name: "Fan", status: false },
        { id: 3, name: "AC", status: false },
      ],
    },
  ]);
  const [selectedRoom, setSelectedRoom] = useState<any>();

  const handlePressRoom = useCallback((room: any) => {
    setSelectedRoom(room);
  }, []);

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#EAA9A9", "#000000", "#514E4E", "#000000"]}
        locations={[0, 0.5, 0.75, 1]}
        style={styles.background}
      >
        <ScrollView style={styles.scrollview}>
          {/* Title Section */}
          <Text style={styles.title}>Home Sweet Home</Text>

          {/* Temperature and Device Info Section */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>22°C</Text>
              <Text style={styles.infoSubText}>Avg House Temp</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>60°F</Text>
              <Text style={styles.infoSubText}>Outside Temp</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>60 %</Text>
              <Text style={styles.infoSubText}>PPP</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>3</Text>
              <Text style={styles.infoSubText}>Devices</Text>
            </View>
          </View>

          {/* Room Section */}
          <Text style={styles.sectionTitle}>Room</Text>
          <View style={styles.buttonGrid}>
            {rooms.map((room) => (
              <TouchableOpacity
                style={{ width: "48%" }}
                onPress={() => {
                  handlePressRoom(room);
                }}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#FDA43C"]}
                  locations={[0.5, 1]}
                  start={{ x: 0, y: 1 }}
                  style={styles.roomButton}
                >
                  <Text style={styles.buttonText}>{room.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Routines Section */}
          <Text style={styles.sectionTitle}>Routines</Text>
          <View style={styles.routineGrid}>
            <TouchableOpacity
              style={[styles.routineButton, styles.activeRoutine]}
            >
              <Text style={styles.buttonText}>Morning</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.routineButton}>
              <Text style={[styles.buttonText, { color: "#FDA43C" }]}>Out</Text>
            </TouchableOpacity>
          </View>

          {/* Device in Use Section */}
          {selectedRoom && (
            <View>
              <Text style={styles.sectionTitle}>
                Device in {selectedRoom.name}
              </Text>
              <LinearGradient
                colors={["#FFFFFF", "#FDA43C"]}
                locations={[0.5, 1]}
                start={{ x: 0, y: 1 }}
                style={styles.deviceIcons}
              >
                <ScrollView horizontal>
                  {selectedRoom.device.map((device: any) => (
                    <TouchableOpacity
                      style={[
                        styles.deviceWrapper,
                        device.status && { backgroundColor: "#C2771E" },
                      ]}
                      onPress={() => {
                        // navigation.navigate("detail", { id: 1 });
                        router.push("/webview");
                      }}
                    >
                      <Text style={styles.deviceText}>{device.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </LinearGradient>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

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
  scrollview: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: "column",
  },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  //   color: "white",
  //   textAlign: "center",
  // },
  parameterWrapper: {
    backgroundColor: "#FEB35B",
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "#FFA726",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  infoSubText: {
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    color: "#FFA726",
    marginVertical: 10,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roomButton: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flex: 1,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  routineGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  routineButton: {
    width: "48%",
    backgroundColor: "#424242",
    borderRadius: 10,
    padding: 15,
  },
  activeRoutine: {
    backgroundColor: "#FFA726",
  },
  deviceIcons: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 40,
  },
  deviceWrapper: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceText: {
    fontSize: 16,
    color: "#000000",
  },
});

export default home;
