import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Using useNavigate from react-router-dom

  useEffect(() => {
    if (search.trim() === "") {
      setSearchData([]);
      setShowResults(false);
      return;
    }

    const fetchSearchDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=6735e8c3309c84ad91765c50b07db479&query=${search}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setSearchData(data.results);
        setShowResults(true);
        setError(null); // Clear any previous errors
        console.log("Search Details", data.results);
      } catch (error) {
        console.error("Error fetching search details:", error);
        setError("Failed to fetch search results"); // Set error state
        setSearchData([]); // Clear previous data on error
        setShowResults(false);
      }
    };

    fetchSearchDetails();
  }, [search]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (search.trim() !== "") {
      navigate(`/searchresults/${search}`);
      setShowResults(false); // Hide dropdown on search
      setSearch(""); // Reset the search input after search
    }
  };
  const handleLinkClick = () => {
    setSearch(""); // Clear search input on link click
    setShowResults(false); // Hide dropdown on link click
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleWatchlist = () => {
    setShowWatchlist(!showWatchlist);
  };

  useEffect(() => {
    const closeSearchResults = (event) => {
      // Check if the click is outside the search container
      if (
        event.target.closest(".search-container") === null &&
        event.target.closest(".search-icon") === null
      ) {
        setShowResults(false);
      }
    };

    // Add event listener to handle clicks on the document body
    document.body.addEventListener("click", closeSearchResults);

    return () => {
      // Clean up event listener on component unmount
      document.body.removeEventListener("click", closeSearchResults);
    };
  }, []);
  useEffect(() => {
    const closeProfile = (event) => {
      // Check if the click is outside the watchlist container
      if (
        event.target.closest(".watchlist") === null &&
        event.target.closest(".watch-link") === null
      ) {
        setShowWatchlist(false);
      }

      // Check if a link inside the watchlist container is clicked
      if (event.target.closest(".watch-link")) {
        setShowWatchlist(false);
      }
    };

    // Add event listener to handle clicks on the document body
    document.body.addEventListener("click", closeProfile);

    return () => {
      // Clean up event listener on component unmount
      document.body.removeEventListener("click", closeProfile);
    };
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle logout
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false); // Assuming setIsLoggedIn is the function to update the login state
    // Redirect to the login page here
    window.location.href = "/login"; // Redirect to the login page
  };

  useEffect(() => {
    // Check if user is in session on component mount
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">
            <img src="./camera.png" alt="Brand Logo" />
          </Link>
        </div>
        <div className="icons-container">
          {windowWidth >= 576 && isLoggedIn ? (
            <form
              className="d-flex"
              role="search"
              onSubmit={handleSearch}
              style={{ position: "relative" }}
            >
              <div className="search-container active">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={handleInputChange}
                />
                <button type="submit">Search</button>
                <div
                  className="search-results position-absolute mt-1"
                  style={{
                    position: "relative",
                    backgroundColor: "rgb(246, 246, 246)",
                    zIndex: "5",
                    width: "18rem",
                    top: "3rem",
                    color: "black",
                    borderRadius: "1rem",
                    display: showResults && !error ? "block" : "none", // Show/hide based on showResults state
                  }}
                >
                  {error && <div>Error: {error}</div>}
                  {showResults && !error && (
                    <div style={{ padding: "5px" }}>
                      {searchData.slice(0, 5).map((result, index) => (
                        <Link
                          key={result.id || index}
                          to={
                            result.media_type === "person"
                              ? `/person/${result.id}`
                              : result.media_type === "movie"
                              ? `/movie/${result.id}`
                              : `/tv/${result.id}`
                          }
                          style={{ textDecoration: "none", color: "inherit" }}
                          onClick={() => {
                            handleLinkClick(); // Call the handleLinkClick function
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "2px",
                            }}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w500${
                                result.profile_path || result.poster_path
                              }`}
                              alt=""
                              width="50rem"
                              className="mr-2"
                              style={{ borderRadius: "10px" }}
                            />
                            <span>{result.title || result.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-icon" style={{ position: "relative" }}>
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className={`fas fa-user ${showWatchlist ? "active" : ""}`}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Profile"
                  style={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "2rem",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWatchlist();
                  }}
                />

                {showWatchlist && (
                  <div
                    style={{
                      position: "absolute",
                      top: "2.5rem",
                      right: "0px",
                      background: "#f6f6f6",
                      borderRadius: "10px",
                      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
                      padding: "5px",
                      opacity: 1,
                      zIndex: 2,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                    className="watchlist"
                  >
                    {isLoggedIn ? (
                      <div className="watch-link" style={{ padding: "5px" }}>
                        <span
                          onClick={() => {
                            handleLogout();
                            setShowWatchlist(false); // Close watchlist on logout
                          }}
                          style={{ color: "black", cursor: "pointer" }}
                        >
                          Logout
                        </span>
                      </div>
                    ) : (
                      <div className="watch-link" style={{ padding: "5px" }}>
                        <Link
                          to="/login"
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                    {isLoggedIn && (
                      <div className="watch-link" style={{ padding: "5px" }}>
                        <Link
                          to="/watchlist"
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          Watchlist
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="d-flex">
              {isLoggedIn && (
                <div className="search-icon" onClick={toggleSearch}>
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={`fas fa-search ${showSearch ? "active" : ""}`}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Search"
                    style={{ color: "black", padding: "0 1rem" }}
                  />
                </div>
              )}
              <div className="profile-icon" style={{ position: "relative" }}>
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className={`fas fa-user ${showWatchlist ? "active" : ""}`}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Profile"
                  style={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "2rem",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleWatchlist();
                  }}
                />

                {showWatchlist && (
                  <div
                    style={{
                      position: "absolute",
                      top: "2.5rem",
                      right: "0px",
                      background: "#f6f6f6",
                      borderRadius: "10px",
                      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
                      padding: "5px",
                      opacity: 1,
                      zIndex: 2,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                    className="watchlist"
                  >
                    {isLoggedIn ? (
                      <div className="watch-link" style={{ padding: "5px" }}>
                        <span
                          onClick={() => {
                            handleLogout();
                            setShowWatchlist(false); // Close watchlist on logout
                          }}
                          style={{ color: "black", cursor: "pointer" }}
                        >
                          Logout
                        </span>
                      </div>
                    ) : (
                      <div className="watch-link" style={{ padding: "5px" }}>
                        <Link
                          to="/login"
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          Sign Up
                        </Link>
                      </div>
                    )}
                    {isLoggedIn && (
                      <div className="watch-link" style={{ padding: "5px" }}>
                        <Link
                          to="/watchlist"
                          style={{ color: "black", textDecoration: "none" }}
                        >
                          Watchlist
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {windowWidth <= 576 && showSearch && (
        <form
          className="search-container active"
          role="search"
          onSubmit={handleSearch}
          style={{ position: "relative" }}
        >
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleInputChange}
          />
          <button type="submit">Search</button>
          <div
            className="search-results position-absolute mt-1"
            style={{
              position: "relative",
              backgroundColor: "rgb(246, 246, 246)",
              zIndex: "100",
              width: "80%",
              top: "3.8rem",
              color: "black",
              borderRadius: "1rem",
              display: showResults && !error ? "block" : "none", // Show/hide based on showResults state
            }}
          >
            {error && <div>Error: {error}</div>}
            {showResults && !error && (
              <div style={{ padding: "5px" }}>
                {searchData.slice(0, 5).map((result, index) => (
                  <Link
                    key={result.id || index}
                    to={
                      result.media_type === "person"
                        ? `/person/${result.id}`
                        : result.media_type === "movie"
                        ? `/movie/${result.id}`
                        : `/tv/${result.id}`
                    }
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => {
                      handleLinkClick(); // Call the handleLinkClick function
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "2px",
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${
                          result.profile_path || result.poster_path
                        }`}
                        alt=""
                        width="50rem"
                        className="mr-2"
                        style={{ borderRadius: "10px" }}
                      />
                      <span>{result.title || result.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </form>
      )}
    </nav>
  );
};

export default Navbar;
