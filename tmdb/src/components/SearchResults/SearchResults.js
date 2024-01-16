import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Cards from "../card/Cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import PersonCard from "../personCard/PersonCard";

const SearchResults = () => {
  const params = useParams();
  const { search_result } = params;

  const [details, setDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // New state to track if there's more data

  const fetchDetails = async (page) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=6735e8c3309c84ad91765c50b07db479&query=${search_result}&page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.results;
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      return [];
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    const fetchData = async () => {
      const results = await fetchDetails(1);
      setDetails(results);
    };
    fetchData();
  }, [search_result]);

  const loadMore = async () => {
    const nextPage = currentPage + 1;
    const results = await fetchDetails(nextPage);
    setCurrentPage(nextPage);
    if (results.length === 0) {
      // If no more data fetched, set hasMore to false
      setHasMore(false);
    } else {
      setDetails([...details, ...results]);
    }
  };

  const displayedItems = details
    .filter(
      (m) =>
        m.poster_path !== null &&
        m.profile_path !== null &&
        m.backdrop_path !== null &&
        m.vote_average !== 0
    )
    .filter((detail) => detail.poster_path !== null)
    .slice(0, currentPage * 8);

  return (
    <div className="container mt-4">
      <h3>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="mx-2" />
        Search : "{search_result}"
      </h3>
      <div className="row">
        {displayedItems.map((detail) => (
          <div key={detail.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            {detail.media_type === "person" ? (
              <PersonCard key={detail.id} detail={detail} />
            ) : (
              <Cards
                key={detail.id}
                detail={detail}
                mediaType={detail.media_type}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center my-4">
        {/* Conditionally render the button based on hasMore state */}
        {hasMore && (
          <button className="btn btn-primary" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
