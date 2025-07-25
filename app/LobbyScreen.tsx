import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { socket } from "../socket/socket";

type Message = { sender: string; message: string };

export default function LobbyScreen() {
  const { lobbyId, username } = useLocalSearchParams<{
    lobbyId: string;
    username: string;
  }>();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const streamingMessageRef = useRef<{ sender: string; index: number } | null>(null);

  useEffect(() => {
    if (!lobbyId) return;

    socket.emit("joinLobby", { lobbyId, username });

    socket.on("chat", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("aiChunk", ({ sender, content }) => {
      setMessages((prev) => {
        if (
          streamingMessageRef.current &&
          streamingMessageRef.current.sender === sender
        ) {
          const updatedMessages = [...prev];
          const index = streamingMessageRef.current.index;
          updatedMessages[index] = {
            sender,
            message: updatedMessages[index].message + content,
          };
          return updatedMessages;
        } else {
          // Start new streaming message
          const newIndex = prev.length;
          streamingMessageRef.current = { sender, index: newIndex };
          setStreamingIndex(newIndex);
          return [...prev, { sender, message: content }];
        }
      });
    });

    socket.on("aiEnd", ({ sender }) => {
      if (streamingMessageRef.current?.sender === sender) {
        setStreamingIndex(null);
        streamingMessageRef.current = null;
      }
    });

    return () => {
      socket.off("chat");
      socket.off("aiChunk");
      socket.off("aiEnd");
    };
  }, [lobbyId]);

  const sendMessage = () => {
    if (!lobbyId || !message.trim()) return;

    socket.emit("sendMessage", {
      lobbyId,
      sender: username,
      message,
    });
    setMessage("");
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === username
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}
            >
              <View style={styles.messageRow}>
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.sender}>{item.sender}</Text>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>
                {index === streamingIndex && (
                  <ActivityIndicator size="small" color="#999" style={styles.spinner} />
                )}
              </View>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            style={styles.input}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, justifyContent: "space-between" },
  messagesList: { padding: 10 },
  messageContainer: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    marginLeft: 8,
  },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#E8E8E8" },
  sender: { fontWeight: "bold", marginBottom: 2 },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
});
