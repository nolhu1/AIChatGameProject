import { socket } from "@/socket/socket";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [lobbyName, setLobbyName] = useState("");
  const [lobbies, setLobbies] = useState<
    { id: string; users: number; maxHumans: number; isPrivate: boolean }[]
  >([]);

  const [maxHumans, setMaxHumans] = useState("");
  const [maxBots, setMaxBots] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    socket.emit("getLobbies");
    socket.on("lobbies", setLobbies);
    return () => {
      socket.off("lobbies");
    };
  }, []);

  const createLobby = () => {
    if (!lobbyName.trim() || !usernameInput.trim()) return;

    socket.emit("createLobby", {
      lobbyId: lobbyName.trim(),
      maxHumans: parseInt(maxHumans),
      maxBots: parseInt(maxBots),
      isPrivate,
    });

    setLobbyName("");
    router.push({
      pathname: "/LobbyScreen",
      params: {
        lobbyId: lobbyName.trim(),
        username: usernameInput.trim(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={lobbies}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <Text style={styles.label}>Your Username</Text>
              <TextInput
                value={usernameInput}
                onChangeText={setUsernameInput}
                placeholder="Enter your username"
                style={styles.input}
              />

              <Text style={styles.label}>Create Lobby</Text>
              <TextInput
                value={lobbyName}
                onChangeText={setLobbyName}
                placeholder="Lobby name"
                style={styles.input}
              />
              <TextInput
                value={maxHumans}
                onChangeText={setMaxHumans}
                placeholder="Max Humans"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                value={maxBots}
                onChangeText={setMaxBots}
                placeholder="Max Bots (<=3)"
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={styles.switchContainer}>
                <Text>Private:</Text>
                <Switch value={isPrivate} onValueChange={setIsPrivate} />
              </View>

              <Button title="Create Lobby" onPress={createLobby} />
              <Text style={styles.header}>Available Lobbies</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Button
              title={`${item.id} (${item.users}/${item.maxHumans}) ${
                item.isPrivate ? "[Private]" : ""
              }`}
              onPress={() => {
                if (!usernameInput.trim()) {
                  alert("Please enter a username before joining a lobby.");
                  return;
                }
                router.push({
                  pathname: "/LobbyScreen",
                  params: {
                    lobbyId: item.id,
                    username: usernameInput.trim(),
                  },
                });
              }}
              color="#444"
            />
          )}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 55
  },
  label: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: "grey",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
});