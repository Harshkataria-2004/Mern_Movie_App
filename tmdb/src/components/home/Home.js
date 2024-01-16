import React, { useEffect, useState } from "react";
import Cards from "../card/Cards";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PersonCard from "../personCard/PersonCard";
import CarouselCard from "../carousel/CarouselCard.js";
import { Link } from "react-router-dom";

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);
  const [popularPeople, setPopularPeople] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [genres, setGenres] = useState([]);
  const topRatedMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&api_key=6735e8c3309c84ad91765c50b07db479`;
  const topRatedTvShowsUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&api_key=6735e8c3309c84ad91765c50b07db479`;
  const popularPeopleUrl = `https://api.themoviedb.org/3/trending/person/day?language=en-US&api_key=6735e8c3309c84ad91765c50b07db479`;
  const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&api_key=6735e8c3309c84ad91765c50b07db479`;
  const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=6735e8c3309c84ad91765c50b07db479`;

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        const response = await fetch(topRatedMoviesUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTopRatedMovies(data.results); // Assuming the movie data is in the "results" property
        // console.log("top rated movies", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    const fetchTopRatedTvShows = async () => {
      try {
        const response = await fetch(topRatedTvShowsUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTopRatedTvShows(data.results); // Assuming the movie data is in the "results" property
        // console.log("top rated tv shows", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await fetch(nowPlayingUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setNowPlaying(data.results); // Assuming the movie data is in the "results" property
        // console.log("now playing movies", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    const fetchGenres = async () => {
      try {
        const response = await fetch(genresUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setGenres(data.genres); // Assuming the movie data is in the "results" property
        // console.log("genres", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    const fetchPopularPeople = async () => {
      try {
        const response = await fetch(popularPeopleUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPopularPeople(data.results); // Assuming the movie data is in the "results" property
        // console.log("popular people", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchTopRatedMovies();
    fetchTopRatedTvShows();
    fetchNowPlayingMovies();
    fetchPopularPeople();
    fetchGenres();
  }, [
    topRatedMoviesUrl,
    topRatedTvShowsUrl,
    popularPeopleUrl,
    nowPlayingUrl,
    genresUrl,
  ]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 2560, min: 1440 },
      items: 5,
    },
    LaptopL: {
      breakpoint: { max: 1440, min: 1024 },
      items: 5,
    },
    Laptop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const responsiveCarousel = {
    superLargeDesktop: {
      breakpoint: { max: 2560, min: 1440 },
      items: 1,
    },
    LaptopL: {
      breakpoint: { max: 1440, min: 1024 },
      items: 1,
    },
    Laptop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div>
      <div className="container">
        <div className="carousel-card">
          <Carousel
            responsive={responsiveCarousel}
            ssr
            removeArrowOnDeviceType={[]}
            draggable
            swipeable
          >
            {nowPlaying
              .filter((m) => {
                return (
                  m.poster_path !== null &&
                  m.backdrop_path !== null &&
                  m.vote_average !== 0
                );
              })
              .map((detail) => (
                <CarouselCard
                  key={detail.id}
                  detail={detail}
                  mediaType="movie"
                />
              ))}
          </Carousel>
        </div>
        <div className="top-rated-movies mt-3">
          <h2>Top Rated Movies</h2>
          <Carousel
            responsive={responsive}
            ssr
            removeArrowOnDeviceType={[]}
            draggable
            swipeable
          >
            {topRatedMovies
              .filter((m) => {
                return (
                  m.poster_path !== null &&
                  m.backdrop_path !== null &&
                  m.vote_average !== 0
                );
              })
              .map((detail) => (
                <Cards key={detail.id} detail={detail} mediaType="movie" />
              ))}
          </Carousel>
        </div>
        <div className="top-rated-tv-show mt-3">
          <h2>Top Rated Tv Shows</h2>
          <Carousel
            responsive={responsive}
            ssr
            removeArrowOnDeviceType={[]}
            draggable
            swipeable
          >
            {topRatedTvShows
              .filter((m) => {
                return (
                  m.poster_path !== null &&
                  m.backdrop_path !== null &&
                  m.vote_average !== 0
                );
              })
              .map((detail) => (
                <Cards key={detail.id} detail={detail} mediaType="tv" />
              ))}
          </Carousel>
        </div>
        <div className="top-rated-tv-show mt-3">
          <h2>Popular Celebs</h2>
          <Carousel
            responsive={responsive}
            ssr
            removeArrowOnDeviceType={[]}
            draggable
            swipeable
          >
            {popularPeople
              .filter((m) => {
                return m.profile_path !== null;
              })
              .map((detail) => (
                <div
                  className="row"
                  style={{ margin: "1rem 0", textAlign: "center" }}
                >
                  {/* Movie cards */}
                  <Link
                    to={`/person/${detail.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <div className="" style={{ border: "none" }}>
                      <img
                        src={
                          "https://image.tmdb.org/t/p/original" +
                          detail.profile_path
                        }
                        className="card-img-top rounded-circle"
                        alt="..."
                        style={{
                          objectFit: "cover",
                          width: "225px", // Set the width to 100% for full width
                          height:"225px"
                          // padding:"0 1rem",
                          // height: "225px", // Automatically adjust height based on the width
                        }}
                      />
                      <div className="" style={{ margin: "0 auto" }}>
                        <h5 style={{ margin: "1rem 0", fontSize: "1.5rem" }}>
                          {detail.name}
                        </h5>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </Carousel>
        </div>
        <div className="genres mt-3">
          <h2>Genres</h2>
          {genres && genres.length > 0 ? (
            <Carousel
              responsive={responsive}
              ssr
              removeArrowOnDeviceType={[]}
              draggable
              swipeable
            >
              {genres.map((detail) => (
                <Link
                  to={`/genre/${detail.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div
                    key={detail.id}
                    style={{
                      backgroundColor: "#f6F6F6",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "3rem",
                      margin: "1rem",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.querySelector("span").style.transform =
                        "scale(1.2)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.querySelector("span").style.transform =
                        "scale(1)")
                    }
                  >
                    <span
                      style={{
                        display: "inline-block",
                        transition: "transform 0.3s ease", // Adding transition for smooth effect
                      }}
                    >
                      {detail.name}
                    </span>
                  </div>
                </Link>
              ))}
            </Carousel>
          ) : (
            <p>No genres available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
