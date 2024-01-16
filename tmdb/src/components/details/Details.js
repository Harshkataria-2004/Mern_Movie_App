import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faStar } from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Details.css"; // Import a CSS file for styling
import PersonCard from "../personCard/PersonCard";
import Cards from "../card/Cards";

const Details = () => {
  const { media_type, detail_id } = useParams();
  const [details, setDetails] = useState([]);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trailer, setTrailer] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${detail_id}?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
          //   console.log("details", data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    const fetchCast = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${detail_id}/credits?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (response.ok) {
          const data = await response.json();
          setCast(data.cast);
          // console.log("cast", data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${detail_id}/recommendations?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.results);
          //   console.log("recommendations", data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${media_type}/${detail_id}/videos?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (response.ok) {
          const data = await response.json();
          setTrailer(data.results[0]);
          // console.log("trailer", data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetails();
    fetchCast();
    fetchRecommendations();
    fetchTrailer();
  }, [media_type, detail_id]);

  const getYearFromDate = (dateString) => {
    return dateString ? dateString.substring(0, 4) : "";
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 2560, min: 1440 },
      items: 4,
    },
    LaptopL: {
      breakpoint: { max: 1440, min: 1024 },
      items: 4,
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
    <div className="main-body container mt-4">
      <div className="video-responsive">
        {trailer && trailer.key ? (
          <iframe
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        ) : details && details.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original/${details.backdrop_path}`}
            alt="Backdrop"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original/${details.poster_path}`}
            alt="Poster"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        )}
      </div>

      <div className="description">
        <div
          className="row mx-2"
          style={{
            borderRadius: "1rem",
            backgroundColor: "#F6F6F6",
            position: "relative",
            padding: "3.3rem 0",
          }}
        >
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 d-flex justify-content-evenly">
            <img
              src={"https://image.tmdb.org/t/p/original" + details.poster_path}
              alt=""
            />
          </div>
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12">
            <div className="row">
              <h3 className="title">
                {details.title || details.name}(
                {getYearFromDate(details.release_date) ||
                  getYearFromDate(details.first_air_date)}
                )
              </h3>
              <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4">
                  Rating
                </div>
                <div className="col-xl-10 col-lg-10 col-md-8 col-sm-8">
                  {details.vote_average !== undefined ? (
                    <span
                      style={{
                        backgroundColor: "#FFC526",
                        padding: "0.4rem",
                        borderRadius: "5px",
                      }}
                    >
                      <FontAwesomeIcon icon={faStar} />{" "}
                      {details.vote_average.toFixed(1)}
                    </span>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faStar} /> 0
                    </>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4">
                  Country
                </div>
                <div className="col-xl-10 col-lg-10 col-md-8 col-sm-8">
                  {details.production_countries &&
                  Array.isArray(details.production_countries)
                    ? details.production_countries.map((country, index) => (
                        <span key={index}>
                          {country.name}
                          {index !== details.production_countries.length - 1 &&
                            ", "}
                        </span>
                      ))
                    : "No production countries available"}
                </div>
              </div>

              <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4">Genre</div>
                <div className="col-xl-10 col-lg-10 col-md-8 col-sm-8">
                  {details.genres &&
                  Array.isArray(details.genres) &&
                  details.genres.length > 0 ? (
                    details.genres.map((genre) => (
                      <>
                        <Link
                          key={genre.id}
                          to={`/genre/${genre.id}`}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#8951FF",
                            color: "white",
                            marginRight: "5px",
                          }}
                        >
                          {genre.name}
                        </Link>
                      </>
                    ))
                  ) : (
                    <span>No genres available</span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4">
                  {media_type === "movie" ? "Runtime" : "Seasons"}
                </div>
                <div className="col-xl-10 col-lg-10 col-md-8 col-sm-8">
                  {media_type === "movie"
                    ? `${details.runtime} min`
                    : `${details.number_of_seasons} seasons`}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4">
                  Release Date
                </div>
                <div className="col-xl-10 col-lg-10 col-md-8 col-sm-8">
                  {details.release_date || details.first_air_date}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-4">
                  Overview
                </div>
                <div className="col-xl-10 col-lg-10 col-md-8 col-sm-8">
                  <p className="overview">{details.overview}</p>
                </div>
              </div>
            </div>
            <Link
              to={localStorage.getItem("userEmail") ? "" : "/login"}
              onClick={() => {
                localStorage.getItem("userEmail") &&
                  storeAll(details.id, details.title ? `movie` : `tv`);
              }}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                zIndex: "1", // Adjust the z-index as needed
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
                  backgroundColor: "#FF3D49",
                  fontSize: "1.2rem",
                  padding: "1rem",
                  borderTopRightRadius: "1rem",
                  // Add any other styles you need here
                }}
              />
            </Link>
          </div>
        </div>
      </div>
      {cast && cast.length !== 0 && (
        <div className="cast">
          <h2>Cast</h2>
          <Carousel
            responsive={responsive}
            ssr
            removeArrowOnDeviceType={[]}
            draggable
            swipeable
          >
            {cast
              .filter((m) => {
                return m.profile_path !== null;
              })
              .map((detail) => (
                <PersonCard key={detail.id} detail={detail} />
              ))}
          </Carousel>
        </div>
      )}
      {recommendations && recommendations.length !== 0 && (
        <div className="recommendations mt-2">
          <h2>Recommendations</h2>
          <Carousel
            responsive={responsive}
            ssr
            removeArrowOnDeviceType={[]}
            draggable
            swipeable
          >
            {recommendations
              .filter((m) => {
                return (
                  m.poster_path !== null &&
                  m.backdrop_path !== null &&
                  m.vote_average !== 0
                );
              })
              .map((detail) => (
                <Cards key={detail.id} detail={detail} mediaType={media_type} />
              ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Details;
