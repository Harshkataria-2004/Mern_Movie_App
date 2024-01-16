import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cards from "../card/Cards";

const GenreSearch = () => {
  const { media_type, genre_id } = useParams();

  const [movieDetails, setMovieDetails] = useState([]);
  const [tvShowDetails, setTvShowDetails] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [displayedItems, setDisplayedItems] = useState(8); // Initial number of items to display
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [allDetails, setAllDetails] = useState([]); // Combine movie and TV show details

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=6735e8c3309c84ad91765c50b07db479&with_genres=${genre_id}&page=${currentPage}`
        );
        const tvShowResponse = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=6735e8c3309c84ad91765c50b07db479&with_genres=${genre_id}&page=${currentPage}`
        );

        if (!movieResponse.ok || !tvShowResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const movieData = await movieResponse.json();
        const tvShowData = await tvShowResponse.json();

        setMovieDetails([...movieDetails, ...movieData.results]);
        setTvShowDetails([...tvShowDetails, ...tvShowData.results]);

        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/${
            media_type === "movie"
              ? "movie"
              : media_type === "tv"
              ? "tv"
              : "movie"
          }/list?api_key=6735e8c3309c84ad91765c50b07db479`
        );

        if (!genreResponse.ok) {
          throw new Error("Failed to fetch genre data");
        }

        const genreData = await genreResponse.json();
        const foundGenre = genreData.genres.find(
          (genre) => genre.id === parseInt(genre_id)
        );
        if (foundGenre) {
          setGenreName(foundGenre.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [genre_id, media_type, currentPage]);

  useEffect(() => {
    // Combine movie and TV show details into a single array
    const combinedDetails = [...movieDetails, ...tvShowDetails];
    setAllDetails(combinedDetails);
  }, [movieDetails, tvShowDetails]);

  // Check if there are more items available to load
  const hasMoreItems = allDetails.length > displayedItems;

  const slicedDetails = allDetails
    .filter(
      (m) =>
        m.poster_path !== null &&
        m.backdrop_path !== null &&
        m.vote_average !== 0
    )
    .slice(0, displayedItems);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
    setDisplayedItems(displayedItems + 8);
  };

  return (
    <div className="container mt-4">
      <h4>{genreName} Movies And Tv Shows</h4>
      <div className="row">
        {slicedDetails.map((detail) => (
          <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={detail.id}>
            <Cards
              key={detail.id}
              detail={detail}
              mediaType={
                detail.name !== undefined
                  ? "tv"
                  : detail.title !== undefined
                  ? "movie"
                  : ""
              }
            />
          </div>
        ))}
      </div>
      {hasMoreItems && (
        <div className="text-center my-4">
          <button className="btn btn-primary" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default GenreSearch;
