export interface ShowtimeLink {
  provider: "fandango" | "atom" | "official" | "other";
  label: string;
  url: string;
}

export interface ShowtimeSlot {
  id: string;
  startTime: string; // ISO 8601 timestamp
  auditorium?: string;
  links: ShowtimeLink[];
}

export interface TheaterShowtime {
  theaterId: string;
  theaterName: string;
  address: string;
  distanceInKm?: number;
  slots: ShowtimeSlot[];
}

export interface MovieShowtime {
  movieId: string;
  title: string;
  posterUrl?: string;
  rating?: string;
  runtimeMinutes?: number;
  synopsis?: string;
  genres?: string[];
  releaseDate?: string;
  showDate: string; // YYYY-MM-DD
  theaters: TheaterShowtime[];
}

export interface ShowtimesResponse {
  city: string;
  country: string;
  showDate: string;
  movies: MovieShowtime[];
}
