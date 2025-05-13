import {
  View,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import {
  RealtimeSessionEngineProvider,
  SDKConnectOptions,
  useRealtimeSessionEngine,
} from "gabber-client-react-native";
import { useCallback, useState } from "react";
import axios from "axios";
import VolumeVisualizer from "@/components/VolumeVisualizer";

export default function HomeScreen() {
  const [connectionOpts, setConnectionOpts] =
    useState<SDKConnectOptions | null>(null);

  const fetchConnectionOpts = useCallback(async () => {
    try {
      const response = await axios.post("http://10.0.2.2:4000/start_session");
      setConnectionOpts({
        connection_details: response.data.connection_details,
      });
    } catch (error) {
      console.error("Error fetching connection options:", error);
    }
  }, []);

  if (!connectionOpts) {
    return (
      <View style={styles.container}>
        <Button
          title="Start Session"
          onPress={async () => {
            console.log("Button pressed");
            await fetchConnectionOpts();
          }}
        />
      </View>
    );
  }

  return (
    <RealtimeSessionEngineProvider connectionOpts={connectionOpts}>
      <LiveComponent onDisconnect={() => setConnectionOpts(null)} />
    </RealtimeSessionEngineProvider>
  );
}

type LiveComponentProps = {
  onDisconnect: () => void;
};

function LiveComponent({ onDisconnect }: LiveComponentProps) {
  const {
    setMicrophoneEnabled,
    microphoneEnabled,
    sendChatMessage,
    messages,
    agentState,
    connectionState,
  } = useRealtimeSessionEngine();
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendChatMessage({ text: chatInput });
      setChatInput(""); // Clear input after sending
    }
  };

  return (
    <View style={styles.container}>
      {/* Display agentState and connectionState */}
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>Agent State: {agentState}</Text>
        <Text style={styles.stateText}>
          Connection State: {connectionState}
        </Text>
      </View>
      <VolumeVisualizer color="#6200ea" />
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageBubble}>
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your message..."
          onSubmitEditing={handleSendMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={microphoneEnabled ? "Disable Mic" : "Enable Mic"}
          onPress={() => setMicrophoneEnabled(!microphoneEnabled)}
        />
        <View style={styles.buttonSpacer} />
        <Button title="Disconnect" onPress={onDisconnect} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  stateContainer: {
    marginBottom: 16,
  },
  stateText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  messageContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonSpacer: {
    height: 16,
  },
});
