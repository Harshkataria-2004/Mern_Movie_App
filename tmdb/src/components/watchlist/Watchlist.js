import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cards from "../card/Cards";

function Watchlist() {
  const [line, setLine] = useState("");
  const [line1, setLine1] = useState("There is no data in your Watchlist");
  const [newarr, setNewarr] = useState([]);
  const [addlist, setAddlist] = useState([]);

  const fetchdata = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      let result = await fetch("http://localhost:5000/getdata", {
        method: "post",
        body: JSON.stringify({ userEmail }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();

      if (result.nodata) {
        setLine(result.nodata);
      } else if (result.watchlist) {
        const fetchedData = [];
        for (const i of result.watchlist) {
          const response = await axios.get(
            `https://api.themoviedb.org/3/${i.media_type}/${i.id}?api_key=c8c3756e312fabeb5d1802af7f1f2510&append_to_response=credits`
          );
          const data = response.data;
          if (!fetchedData.some((item) => item.id === data.id)) {
            data.mediaType = i.media_type; // Assign mediaType from backend
            fetchedData.push(data);
          }
        }
        setNewarr(fetchedData);
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

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
        console.log("got initial data!");
        setAddlist(result.datalist);
      }
      console.warn(result);
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    fetchdata();
    getInitialData();
  }, [newarr]);

  const storeAll = async (id, media_type) => {
    try {
      console.log(id);
      console.log(media_type);
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
        setAddlist([...addlist, result.added_id]);
      }
      console.warn(result);
      setNewarr([]);
      fetchdata();
      getInitialData();
    } catch (error) {
      console.error("Error :", error);
    }
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <div className="movies container">
        {line ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <h2 className="heading4" style={{ padding: "0" }}>
              {line}
            </h2>
          </div>
        ) : (
          <>
            {/* Movies Section */}
            <div>
              <h2>Movies Watchlist</h2>
              <div className="row">
                {newarr
                  .filter((v) => {
                    return (
                      v.mediaType === "movie" &&
                      v.poster_path !== null &&
                      v.profile_path !== null &&
                      v.overview !== "" &&
                      v.vote_average !== 0.0
                    );
                  })
                  .map((detail) => (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                      key={detail.id}
                    >
                      <Cards
                        detail={detail}
                        mediaType={detail.mediaType} // Use mediaType from backend
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* TV Shows Section */}
            <div>
              <h2>TV Shows Watchlist</h2>
              <div className="row">
                {newarr
                  .filter((v) => {
                    return (
                      v.mediaType === "tv" &&
                      v.poster_path !== null &&
                      v.profile_path !== null &&
                      v.overview !== "" &&
                      v.vote_average !== 0.0
                    );
                  })
                  .map((detail) => (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                      key={detail.id}
                    >
                      <Cards
                        detail={detail}
                        mediaType={detail.mediaType} // Use mediaType from backend
                      />
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
