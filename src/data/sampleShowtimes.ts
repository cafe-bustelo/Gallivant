import { ShowtimesResponse } from "../types/showtimes";

export const sampleShowtimes: ShowtimesResponse = {
  city: "San Francisco",
  country: "US",
  showDate: "2024-07-04",
  movies: [
    {
      movieId: "movie-1",
      title: "Star Voyagers",
      rating: "PG-13",
      runtimeMinutes: 132,
      genres: ["Sci-Fi", "Adventure"],
      synopsis:
        "A team of explorers jump through wormholes to reconnect distant human colonies before a cosmic storm hits.",
      posterUrl:
        "https://images.pexels.com/photos/7991372/pexels-photo-7991372.jpeg?auto=compress&cs=tinysrgb&w=400",
      releaseDate: "2024-06-21",
      showDate: "2024-07-04",
      theaters: [
        {
          theaterId: "theater-1",
          theaterName: "AMC Metreon 16",
          address: "135 4th St, San Francisco, CA",
          distanceInKm: 0.8,
          slots: [
            {
              id: "slot-1",
              startTime: "2024-07-04T18:15:00-07:00",
              auditorium: "IMAX",
              links: [
                {
                  provider: "fandango",
                  label: "Fandango",
                  url: "https://www.fandango.com/amc-metreon-16-aaffk/theater-page",
                },
                {
                  provider: "atom",
                  label: "Atom Tickets",
                  url: "https://www.atomtickets.com/theaters/amc-metreon-16/8073",
                },
              ],
            },
            {
              id: "slot-2",
              startTime: "2024-07-04T21:45:00-07:00",
              links: [
                {
                  provider: "official",
                  label: "AMC",
                  url: "https://www.amctheatres.com/movie-theatres/san-francisco/amc-metreon-16",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      movieId: "movie-2",
      title: "Culinary Hearts",
      rating: "PG",
      runtimeMinutes: 108,
      genres: ["Romance", "Drama"],
      synopsis:
        "Two rival chefs must collaborate on a food festival menu that rekindles a long-forgotten spark.",
      showDate: "2024-07-04",
      theaters: [
        {
          theaterId: "theater-2",
          theaterName: "Alamo Drafthouse New Mission",
          address: "2550 Mission St, San Francisco, CA",
          distanceInKm: 2.1,
          slots: [
            {
              id: "slot-3",
              startTime: "2024-07-04T17:30:00-07:00",
              links: [
                {
                  provider: "fandango",
                  label: "Fandango",
                  url: "https://www.fandango.com/alamo-drafthouse-cinema-san-francisco-ca-theater-page",
                },
                {
                  provider: "other",
                  label: "In-App Browser",
                  url: "https://drafthouse.com/sf/theater/new-mission",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
