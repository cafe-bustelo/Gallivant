import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import MovieShowtimeBrowser from "./src/components/movie/MovieShowtimeBrowser";
import { sampleShowtimes } from "./src/data/sampleShowtimes";

export default function App() {
  const [showDate, setShowDate] = useState(sampleShowtimes.showDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MovieShowtimeBrowser
          city={sampleShowtimes.city}
          showDate={showDate}
          showtimes={sampleShowtimes}
          onDateChange={(value) => setShowDate(value)}
          onRefresh={() => {
            /* Hook in API refresh logic */
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scrollContent: {
    flexGrow: 1,
  },
});
