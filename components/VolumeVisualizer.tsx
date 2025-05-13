import { View, Text, StyleSheet } from "react-native";
import { useRealtimeSessionEngine } from "gabber-client-react-native";

type VolumeVisualizerProps = {
  color: string; // Color for the visualization bars
};

function VolumeVisualizer({ color }: VolumeVisualizerProps) {
  const { agentVolume, agentVolumeBands, userVolume, userVolumeBands } =
    useRealtimeSessionEngine();

  // Function to render volume bars for bands
  const renderVolumeBars = (bands: number[], label: string) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.barsContainer}>
        {bands.map((band, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: band * 50, // Scale band value to height (adjust as needed)
                backgroundColor: color,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Agent Volume and Bands */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Agent Volume: {(agentVolume * 100).toFixed(0)}%
        </Text>
        {renderVolumeBars(agentVolumeBands, "Agent Volume Bands")}
      </View>

      {/* User Volume and Bands */}
      <View style={styles.section}>
        <Text style={styles.label}>
          User Volume: {(userVolume * 100).toFixed(0)}%
        </Text>
        {renderVolumeBars(userVolumeBands, "User Volume Bands")}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 50,
  },
  bar: {
    width: 10,
    borderRadius: 2,
    minHeight: 2, // Ensure bars are visible even at low values
  },
});

export default VolumeVisualizer;
