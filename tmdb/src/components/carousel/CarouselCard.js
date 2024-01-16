import React, { useState, useEffect } from "react";
import "./CarouselCard.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const CarouselCard = ({ detail, mediaType }) => {
  const [addlist, setAddlist] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${detail.id}?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
          // console.log("details", data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetails();
  }, [mediaType, detail.id]);

  const getInitialData = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      let result = await fetch("http://localhost:5000/initialdata", {
        method: "post",
        body: JSON.stringify({ userEmail }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.message) {
        setAddlist(result.datalist);
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };
  useEffect(() => {
    {
      localStorage.getItem("userEmail") && getInitialData();
    }
  }, []);
  const storeAll = async (id, media_type) => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      let result = await fetch("http://localhost:5000/watchlist", {
        method: "post",
        body: JSON.stringify({ media_type, id, userEmail }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.removedmovie) {
        console.log(result.removedmovie);
      } else if (result.message) {
        console.log("movie added");
      }
      getInitialData();
    } catch (error) {
      console.error("Error :", error);
    }
  };
  const getYearFromDate = (dateString) => {
    return dateString ? dateString.substring(0, 4) : "";
  };
  return (
    <div class="carousel_card" id="tomb" style={{ margin: "2rem auto" }}>
      <Link
        to={mediaType === "movie" ? `/movie/${detail.id}` : `/tv/${detail.id}`}
        style={{ textDecoration: "none" }}
      >
        <div class="info_section">
          <div class="movie_header">
            <img
              class="locandina"
              src={"https://image.tmdb.org/t/p/original" + detail.poster_path}
              alt=""
            />
            <h1>
              {mediaType === "movie"
                ? detail.title && detail.title.length > 40
                  ? `${detail.title.slice(0, 40)}...`
                  : detail.title
                : detail.name && detail.name.length > 40
                ? `${detail.name.slice(0, 40)}...`
                : detail.name}
            </h1>
            <h4>
              {mediaType === "movie"
                ? getYearFromDate(detail.release_date)
                : getYearFromDate(detail.first_air_date)}
              {details.created_by &&
              Array.isArray(details.created_by) &&
              details.created_by.length > 0 ? (
                <>
                  ,{" "}
                  {details.created_by.map((created_by, index) => (
                    <React.Fragment key={created_by.id}>
                      {index > 0 && ", "}
                      {created_by.name}
                    </React.Fragment>
                  ))}
                </>
              ) : null}
            </h4>
            <span class="minutes">
              {mediaType === "movie"
                ? `${details.runtime} min`
                : `${details.number_of_seasons} seasons`}
            </span>
            <p className="type">
              {details.genres &&
              Array.isArray(details.genres) &&
              details.genres.length > 0 ? (
                details.genres.map((genre, index) => (
                  <React.Fragment key={genre.id}>
                    {index > 0 && ", "}
                    {genre.name}
                  </React.Fragment>
                ))
              ) : (
                <span>No genres available</span>
              )}
            </p>
          </div>
          <div class="movie_desc">
            <p class="text">{detail.overview}</p>
          </div>
          <div class="movie_social">
            <ul>
              <li>
                <Link
                  to={localStorage.getItem("userEmail") ? "" : "/login"}
                  onClick={() => {
                    localStorage.getItem("userEmail") &&
                      storeAll(details.id, details.title ? `movie` : `tv`);
                  }}
                  style={{
                    backgroundColor: "#FF3D49",
                    fontSize: "1.2rem",
                    padding: "1rem 1rem 1rem 0",
                    borderRadius: "1rem",
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className="fas fa-play"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={
                      addlist.includes(details.id)
                        ? "Remove From Watchlist"
                        : "Add To Watchlist"
                    }
                    style={{
                      color: addlist.includes(details.id) ? "yellow" : "white",
                      // backgroundColor: "#FF3D49",
                      // fontSize: "1.2rem",
                      padding: "0 1rem",
                      // Add any other styles you need here
                    }}
                  />
                  Bookmark
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="blur_back tomb_back"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
          }}
        ></div>
      </Link>
    </div>
  );
};

export default CarouselCard;
