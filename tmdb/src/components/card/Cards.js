import React, { useEffect,useState } from "react";
import "./Cards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faStar } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript
import { Link } from "react-router-dom";

const Cards = ({ detail, mediaType }) => {
  const [addlist, setAddlist] = useState([]);

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
  return (
    <div className="row justify-content-center">
      {/* Movie cards */}
      <div className="card movie_card position-relative">
        <Link
          to={
            mediaType === "movie" ? `/movie/${detail.id}` : `/tv/${detail.id}`
          }
        >
          <img
            src={"https://image.tmdb.org/t/p/original" + detail.poster_path}
            className="card-img-top"
            alt="..."
            style={{
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              height: "25rem",
            }}
          />
        </Link>
        <div className="d-flex justify-content-center align-items-center play_button">
          <Link
            to={localStorage.getItem("userEmail") ? "" : "/login"}
            onClick={() => {
              localStorage.getItem("userEmail") &&
                storeAll(detail.id, detail.title ? `movie` : `tv`);
            }}
          >
            <FontAwesomeIcon
              icon={faBookmark}
              className="fas fa-play"
              data-toggle="tooltip"
              data-placement="bottom"
              title={addlist.includes(detail.id) ?"Remove From Watchlist":"Add To Watchlist"}
              style={{
                color: addlist.includes(detail.id) ? "yellow" : "white",
                // Add any other styles you need here
              }}
            />
          </Link>
        </div>
        <div className="card-body">
          <Link
            to={
              mediaType === "movie" ? `movie/${detail.id}` : `tv/${detail.id}`
            }
            className="details-link"
          >
            <h5 className="card-title">
              {mediaType === "movie"
                ? detail.title && detail.title.length > 40
                  ? `${detail.title.slice(0, 40)}...`
                  : detail.title
                : detail.name && detail.name.length > 40
                ? `${detail.name.slice(0, 40)}...`
                : detail.name}
            </h5>
          </Link>
          <div className="row justify-content-between">
            <span className="movie_info col-6">
              {mediaType === "movie" &&
                detail.release_date &&
                detail.release_date.substring(0, 4)}

              {mediaType === "tv" &&
                detail.first_air_date &&
                detail.first_air_date.substring(0, 4)}
            </span>
            <span className="movie_info col-6 text-end">
              <FontAwesomeIcon icon={faStar} />{" "}
              {detail.vote_average ? detail.vote_average.toFixed(1) : "N/A"} /
              10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
