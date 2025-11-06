import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import type {
  MovieShowtime,
  ShowtimesResponse,
  TheaterShowtime,
} from "../../types/showtimes";

interface MovieShowtimeBrowserProps {
  city: string;
  showDate: string;
  isLoading?: boolean;
  showtimes?: ShowtimesResponse;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  onDateChange?: (date: string) => void;
}

const providerColors: Record<string, string> = {
  fandango: "#ff7300",
  atom: "#3f8cff",
  official: "#058c42",
  other: "#6c5ce7",
};

const providerLabels: Record<string, string> = {
  fandango: "Fandango",
  atom: "Atom",
  official: "Official",
  other: "Browser",
};

export const MovieShowtimeBrowser = ({
  city,
  showDate,
  isLoading,
  showtimes,
  onRefresh,
  onSearch,
  onDateChange,
}: MovieShowtimeBrowserProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [localDate, setLocalDate] = useState(showDate);

  useEffect(() => {
    setLocalDate(showDate);
  }, [showDate]);

  const movies = useMemo(() => {
    if (!showtimes?.movies) {
      return [] as MovieShowtime[];
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) {
      return showtimes.movies;
    }

    return showtimes.movies.filter((movie) => {
      const matchesTitle = movie.title.toLowerCase().includes(trimmedQuery);
      const matchesGenre = movie.genres?.some((genre) =>
        genre.toLowerCase().includes(trimmedQuery)
      );
      return matchesTitle || matchesGenre;
    });
  }, [searchQuery, showtimes?.movies]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const closeWebview = useCallback(() => {
    setSelectedUrl(null);
    setSelectedMovie(null);
  }, []);

  const keyExtractor = useCallback((item: TheaterShowtime) => item.theaterId, []);

  const handleTicketPress = useCallback(
    (url: string, movieTitle: string) => {
      setSelectedUrl(url);
      setSelectedMovie(movieTitle);
    },
    []
  );

  const openExternal = useCallback(async () => {
    if (!selectedUrl) return;
    const supported = await Linking.canOpenURL(selectedUrl);
    if (supported) {
      await Linking.openURL(selectedUrl);
    }
  }, [selectedUrl]);

  const renderMovieCard = useCallback(
    ({ item }: { item: MovieShowtime }) => {
      return (
        <View style={styles.movieCard}>
          <View style={styles.movieHeader}>
            {item.posterUrl ? (
              <Image source={{ uri: item.posterUrl }} style={styles.poster} />
            ) : null}
            <View style={styles.movieHeaderText}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <View style={styles.movieMetaRow}>
                {item.rating ? (
                  <Text style={styles.movieMeta}>Rated {item.rating}</Text>
                ) : null}
                {item.runtimeMinutes ? (
                  <Text style={styles.movieMeta}>{item.runtimeMinutes} min</Text>
                ) : null}
              </View>
              {item.genres?.length ? (
                <Text style={styles.movieGenres}>{item.genres.join(" · ")}</Text>
              ) : null}
              {item.synopsis ? (
                <Text style={styles.movieSynopsis}>{item.synopsis}</Text>
              ) : null}
            </View>
          </View>
          <FlatList
            data={item.theaters}
            renderItem={({ item: theater }) => (
              <ShowtimeRow
                theater={theater}
                onSelectTicketUrl={(url) => handleTicketPress(url, item.title)}
              />
            )}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            scrollEnabled={false}
          />
        </View>
      );
    },
    [handleTicketPress, keyExtractor]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Movie showtimes in {city}</Text>
      <Text style={styles.subheading}>Showing schedule for {showDate}</Text>
      <View style={styles.controlsRow}>
        <TextInput
          placeholder="Search by movie or genre"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
          returnKeyType="search"
        />
        <TextInput
          placeholder="YYYY-MM-DD"
          value={localDate}
          onChangeText={(value) => {
            setLocalDate(value);
            onDateChange?.(value);
          }}
          style={styles.dateInput}
          accessibilityLabel="Change show date"
        />
      </View>
      <Pressable style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshText}>Refresh showtimes</Text>
      </Pressable>
      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Fetching the latest screenings…</Text>
        </View>
      ) : null}
      {!isLoading && movies.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyHeading}>No showtimes found</Text>
          <Text style={styles.emptyCopy}>
            Try another search term or pick a different date to see what’s playing nearby.
          </Text>
        </View>
      ) : null}
      <FlatList
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.movieId}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.listDivider} />}
      />

      <Modal
        visible={Boolean(selectedUrl)}
        animationType="slide"
        onRequestClose={closeWebview}
      >
        <View style={styles.webviewContainer}>
          <View style={styles.webviewHeader}>
            <Text style={styles.webviewTitle}>{selectedMovie ?? "Ticketing"}</Text>
            <View style={styles.webviewActions}>
              <Pressable style={styles.webviewButton} onPress={openExternal}>
                <Text style={styles.webviewButtonText}>Open in browser</Text>
              </Pressable>
              <Pressable style={styles.webviewButton} onPress={closeWebview}>
                <Text style={styles.webviewButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
          {selectedUrl ? (
            <WebView source={{ uri: selectedUrl }} startInLoadingState />
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

interface ShowtimeRowComponentProps {
  theater: TheaterShowtime;
  onSelectTicketUrl: (url: string) => void;
}

const ShowtimeRow = ({ theater, onSelectTicketUrl }: ShowtimeRowComponentProps) => {
  return (
    <View style={styles.theaterCard}>
      <View style={styles.theaterHeader}>
        <Text style={styles.theaterName}>{theater.theaterName}</Text>
        {typeof theater.distanceInKm === "number" ? (
          <Text style={styles.theaterDistance}>
            {theater.distanceInKm.toFixed(1)} km away
          </Text>
        ) : null}
      </View>
      <Text style={styles.theaterAddress}>{theater.address}</Text>
      <View style={styles.slotGrid}>
        {theater.slots.map((slot) => (
          <View key={slot.id} style={styles.slotCard}>
            <Text style={styles.slotTime}>
              {new Date(slot.startTime).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
            {slot.auditorium ? (
              <Text style={styles.slotAuditorium}>{slot.auditorium}</Text>
            ) : null}
            <View style={styles.linkRow}>
              {slot.links.map((link) => (
                <Pressable
                  key={`${slot.id}-${link.provider}`}
                  style={[styles.linkPill, { backgroundColor: providerColors[link.provider] ?? "#1d4ed8" }]}
                  onPress={() => onSelectTicketUrl(link.url)}
                >
                  <Text style={styles.linkPillText}>
                    {link.label || providerLabels[link.provider] || "Tickets"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#f8fafc",
  },
  subheading: {
    marginTop: 4,
    marginBottom: 16,
    color: "#cbd5f5",
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    color: "#e2e8f0",
  },
  dateInput: {
    width: 130,
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    color: "#e2e8f0",
  },
  refreshButton: {
    alignSelf: "flex-start",
    backgroundColor: "#4338ca",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 16,
  },
  refreshText: {
    color: "#ede9fe",
    fontWeight: "600",
  },
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  loadingText: {
    color: "#cbd5f5",
  },
  emptyState: {
    backgroundColor: "#1e1b4b",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e0e7ff",
  },
  emptyCopy: {
    marginTop: 6,
    color: "#c7d2fe",
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 120,
  },
  listDivider: {
    height: 24,
  },
  movieCard: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1f2937",
    gap: 12,
  },
  movieHeader: {
    flexDirection: "row",
    gap: 16,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#1f2937",
  },
  movieHeaderText: {
    flex: 1,
    gap: 6,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
  },
  movieMetaRow: {
    flexDirection: "row",
    gap: 10,
  },
  movieMeta: {
    color: "#a5b4fc",
    fontWeight: "500",
  },
  movieGenres: {
    color: "#c4b5fd",
  },
  movieSynopsis: {
    color: "#cbd5f5",
    lineHeight: 20,
  },
  divider: {
    height: 12,
  },
  theaterCard: {
    backgroundColor: "#0b1120",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  theaterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e0e7ff",
  },
  theaterDistance: {
    color: "#94a3b8",
  },
  theaterAddress: {
    color: "#cbd5f5",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  slotCard: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 14,
    width: "48%",
    gap: 8,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fef3c7",
  },
  slotAuditorium: {
    color: "#fde68a",
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  linkPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  linkPillText: {
    color: "white",
    fontWeight: "600",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#020617",
  },
  webviewHeader: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  webviewTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  webviewActions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 16,
  },
  webviewButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  webviewButtonText: {
    color: "#ede9fe",
    fontWeight: "600",
  },
});

export default MovieShowtimeBrowser;
