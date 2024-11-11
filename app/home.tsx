import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	Text,
	StyleSheet,
	View,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import { IOSOutputFormat } from "expo-av/build/Audio";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const home: FC = () => {
	const router = useRouter();
	const [recording, setRecording] = useState<Audio.Recording>();
	const [audio, setAudio] = useState<string>();
	const [permissionResponse, requestPermission] = Audio.usePermissions();
	const [rooms, setRooms] = useState([
		{
			id: 1,
			name: "Room 1",
			device: [
				{ id: 1, name: "Camera", status: true },
				{ id: 2, name: "Light 1", status: false },
				{ id: 3, name: "Door", status: false },
			],
		},
		{
			id: 2,
			name: "Room 2",
			device: [
				{ id: 5, name: "Light 2", status: false },
				{ id: 6, name: "Fan", status: false },
			],
		},
	]);

	const labels = useMemo(() => {
		return [
			{
				label: "bật đèn một",
				url: "/api/turn-led-on",
				name: "Light 1",
				status: true,
			},
			{
				label: "bật đèn hai",
				url: "/api/turn-led-outdoor-on",
				name: "Light 2",
				status: true,
			},
			{
				label: "tắt đèn một",
				url: "/api/turn-led-off",
				name: "Light 1",
				status: false,
			},
			{
				label: "tắt đèn hai",
				url: "/api/turn-led-outdoor-off",
				name: "Light 2",
				status: false,
			},
			{
				label: "mở cửa",
				url: "/api/open-door",
				name: "Door",
				status: true,
			},
			{
				label: "đóng cửa",
				url: "/api/close-door",
				name: "Door",
				status: false,
			},
			{
				label: "bật quạt",
				url: "/api/turn-fan-on",
				name: "Fan",
				status: true,
			},
			{
				label: "tắt quạt",
				url: "/api/turn-fan-off",
				name: "Fan",
				status: false,
			},
		];
	}, []);

	const [selectedRoom, setSelectedRoom] = useState<any>();

	const handlePressRoom = useCallback((room: any) => {
		setSelectedRoom(room);
	}, []);

	async function startRecording() {
		try {
			if (permissionResponse?.status !== "granted") {
				console.log("Requesting permission..");
				await requestPermission();
			}
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			console.log("Starting recording..");
			const { recording } = await Audio.Recording.createAsync({
				...Audio.RecordingOptionsPresets.HIGH_QUALITY,
				ios: {
					...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
					extension: ".wav",
					outputFormat: IOSOutputFormat.LINEARPCM,
				},
			});
			setRecording(recording);
			console.log("Recording started");
		} catch (err) {
			console.error("Failed to start recording", err);
		}
	}

	async function stopRecording() {
		console.log("Stopping recording..");
		setRecording(undefined);
		await recording?.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
		});
		const uri = recording?.getURI();
		if (uri) {
			setAudio(uri);
			const formData = new FormData();
			//@ts-ignore
			formData.append("file", {
				uri: uri,
				name: "filename.wav",
				type: "audio/wav",
			});
			try {
				const response = await axios.post(
					"https://4cf6-117-2-255-206.ngrok-free.app/upload",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				const transcript = response.data.transcript;
				console.log(transcript);

				const label_result = labels.find((e) => e.label === transcript);
				if (label_result) {
					const data = await axios.get(
						`http://10.10.27.143${label_result.url}`,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					);
					const newState = rooms.map((room) => {
						if (room.device) {
							room.device = room.device.map((e) =>
								e.name === label_result.name
									? { ...e, status: label_result.status }
									: e
							);
						}
						return room;
					});
					setRooms(newState);
					console.log(data.data);
				}
			} catch (error: any) {
				console.error("Error uploading file", error?.message);
			}
		}
	}

	const handleTurnDevice = async (device: any) => {
		try {
			let url = "";
			if (device.status) {
				if (device.name === "Light 1") url = "/api/turn-led-off";
				if (device.name === "Light 2") url = "/api/turn-led-outdoor-off";
				if (device.name === "Door") url = "/api/open-door";
				if (device.name === "Fan") url = "/api/turn-fan-off";
			} else {
				if (device.name === "Light 1") url = "/api/turn-led-on";
				if (device.name === "Light 2") url = "/api/turn-led-outdoor-on";
				if (device.name === "Door") url = "/api/close-door";
				if (device.name === "Fan") url = "/api/turn-fan-on";
			}
			const data = await axios.get(`http://10.10.27.143${url}`, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(data.data);
			const newState = rooms.map((room) => {
				if (room.device) {
					room.device = room.device.map((e) =>
						e.name === device.name ? { ...e, status: !e.status } : e
					);
				}
				return room;
			});

			setRooms(newState);
		} catch (error) {
			console.log(error);
		}
	};

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
					<Text style={styles.sectionTitle}>Voice control</Text>
					<View style={styles.routineGrid}>
						<TouchableOpacity
							style={[
								styles.routineButton,
								styles.activeRoutine,
								{
									width: "100%",
									alignItems: "center",
									justifyContent: "center",
								},
							]}
							onPress={recording ? stopRecording : startRecording}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text
									style={[
										styles.buttonText,
										recording && styles.stopRecordingText,
									]}
								>
									{recording ? "Stop Recording" : "Start Recording"}
								</Text>
								{recording ? (
									<Ionicons
										name="stop-circle"
										size={28}
										style={{
											marginLeft: 8,
										}}
										color={"white"}
									/>
								) : (
									<Ionicons
										name="radio-button-on"
										size={28}
										style={{
											marginLeft: 8,
										}}
									/>
								)}
							</View>
						</TouchableOpacity>
						{/* <TouchableOpacity style={styles.routineButton}>
              <Text style={[styles.buttonText, { color: "#FDA43C" }]}>Out</Text>
            </TouchableOpacity> */}
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
								<ScrollView>
									{selectedRoom.device.map((device: any) => (
										<TouchableOpacity
											style={[styles.deviceWrapper]}
											onPress={() => {
												if (device.name === "Camera") {
													router.push({
														pathname: "/detail",
														params: { ...device },
													});
												}
											}}
										>
											<Text style={styles.deviceText}>{device.name}</Text>
											<Switch
												trackColor={{ false: "#767577", true: "#81b0ff" }}
												thumbColor={device.status ? "#FFFFFF" : "#f4f3f4"}
												onValueChange={() => {
													handleTurnDevice(device);
												}}
												value={device.status}
											/>
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
		backgroundColor: "#f0421d",
	},
	deviceIcons: {
		paddingHorizontal: 20,
		paddingVertical: 5,
		borderRadius: 40,
	},
	deviceWrapper: {
		width: "100%",
		height: 70,
		marginRight: 10,
		borderRadius: 70,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
	},
	deviceText: {
		fontSize: 16,
		color: "#000000",
	},
	stopRecordingText: {
		color: "#ffffff",
	},
});

export default home;
