import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./PersonDetail.css";
import Cards from "../card/Cards";

const PersonDetail = () => {
  const params = useParams();
  const { person_id } = params;

  const [details, setDetails] = useState({});
  const [type, setType] = useState("movie_credits");
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${person_id}?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setDetails(data); // Assuming the movie data is in the "results" property
        // console.log("person details", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchDetails();
  }, []);
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${person_id}/${type}?api_key=6735e8c3309c84ad91765c50b07db479`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (type === "movie_credits") {
          setMovieCredits(data.cast || []);
          setTvCredits([]);
        } else if (type === "tv_credits") {
          setTvCredits(data.cast || []);
          setMovieCredits([]);
        }

        // console.log("Credits", data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchCredits();
  }, [type]);

  const [expanded, setExpanded] = useState(false);

  if (!details || !details.biography) {
    return null; // Or handle the case where details or biography is missing
  }

  const bioWords = details.biography.split(" ");

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const displayBio =
    bioWords.length > 100 && !expanded
      ? bioWords.slice(0, 100).join(" ") + "..."
      : details.biography;

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 person-img">
          <img
            src={`https://image.tmdb.org/t/p/original${details.profile_path}`}
            alt=""
          />
        </div>
        <div className="col-xl-9 col-lg-9 col-md-8 col-sm-12">
          <div className="row">
            <div className="col-12">
              <h2>{details.name}</h2>
            </div>
            <div className="col-12">
              <h5>Biography</h5>
              <p
                style={{
                  lineHeight: "1.1",
                  textAlign: "justify",
                  marginBottom: "1em",
                }}
              >
                {displayBio}
                {bioWords.length > 100 && (
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={toggleExpansion}
                  >
                    {" "}
                    {expanded ? "-Read less" : "+Read more"}
                  </span>
                )}
              </p>
            </div>
            <div className="col-12">
              <div className="row">
                <h3 className="h3">Personal Info</h3>
                <span className="col-xl-3 col-lg-3 col-md-4 col-sm-6 my-1">
                  <p className="fw-bold">Known For</p>
                  <p>{details.known_for_department}</p>
                </span>
                <span className="col-xl-3 col-lg-3 col-md-4 col-sm-6 my-1">
                  <p className="fw-bold">Gender</p>
                  <p>{details.gender == 1 ? "Female" : "Male"}</p>
                </span>
                <span className="col-xl-3 col-lg-3 col-md-4 col-sm-6 y-1">
                  <p className="fw-bold">Birthdate</p>
                  <p>{details.birthday}</p>
                </span>
                <span className="col-xl-3 col-lg-3 col-md-4 col-sm-6 y-1">
                  <p className="fw-bold">Place of Birth</p>
                  <p>{details.place_of_birth}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="credit mt-4">
        <ul
          id="myTab"
          role="tablist"
          className="nav nav-tabs nav-pills flex-column flex-sm-row text-center bg-light border-0 rounded-nav"
        >
          <li className="nav-item flex-sm-fill">
            <div
              id="movie-credits-tab"
              data-toggle="tab"
              href="#movie-credits"
              role="tab"
              aria-controls="movie-credits"
              aria-selected={type === "movie_credits" ? "true" : "false"}
              className={`nav-link border-0 text-uppercase font-weight-bold ${
                type === "movie_credits" ? "active" : ""
              }`}
              onClick={() => setType("movie_credits")}
            >
              Movies
            </div>
          </li>
          <li className="nav-item flex-sm-fill">
            <div
              id="tv-credits-tab"
              data-toggle="tab"
              href="#tv-credits"
              role="tab"
              aria-controls="tv-credits"
              aria-selected={type === "tv_credits" ? "true" : "false"}
              className={`nav-link border-0 text-uppercase font-weight-bold ${
                type === "tv_credits" ? "active" : ""
              }`}
              onClick={() => setType("tv_credits")}
            >
              Tv Shows
            </div>
          </li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <div
            id={type}
            role="tabpanel"
            aria-labelledby={`${type}-tab`}
            className="tab-pane fade px-4 py-5 show active"
          >
            <div className="row">
              {(type === "movie_credits"
                ? movieCredits
                : type === "tv_credits"
                ? tvCredits
                : []
              )
                .filter((p) => {
                  return (
                    p.poster_path !== null &&
                    p.backdrop_path !== null &&
                    p.vote_average !== 0
                  );
                })
                .sort((a, b) => {
                  return new Date(b.release_date||b.first_air_date) - new Date(a.release_date||a.first_air_date);
                })
                .map((detail) => (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <Cards
                      key={detail.id}
                      detail={detail}
                      mediaType={type === "movie_credits" ? "movie" : "tv"}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;
