import React, { useEffect } from "react";
import "./PersonCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript
import { Link } from "react-router-dom";

const PersonCard = ({ detail }) => {
  return (
    <div className="row justify-content-center cast">
      {/* Movie cards */}
      <div className="card person_card position-relative">
        <Link to={`/person/${detail.id}`}>
          <img
            src={"https://image.tmdb.org/t/p/original" + detail.profile_path}
            className="card-img-top"
            alt="..."
            style={{
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              height: "25rem",
              objectFit: "cover",
            }}
          />
        </Link>
        {/* <div className="d-flex justify-content-center align-items-center play_button">
          <FontAwesomeIcon
            icon={faBookmark}
            className="fas fa-play"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Add To Watchlist"
          />
        </div> */}
        <div className="card-body">
          <Link to={`person/${detail.id}`} className="details-link">
            <h5 className="card-title">{detail.name}</h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;



// import React from "react";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript

// const PersonCard = ({ detail }) => {
//   return (
//     <div className="row" style={{ margin: "1rem 0" ,textAlign:"center"}}>
//       {/* Movie cards */}
//       <Link to={`/person/${detail.id}`} style={{ textDecoration: "none", color: "black" }}>
//         <div className="" style={{ border: "none" }}>
//           <img
//             src={"https://image.tmdb.org/t/p/original" + detail.profile_path}
//             className="card-img-top rounded-circle"
//             alt="..."
//             style={{
//               objectFit: "cover",
//               width: "275px", // Set the width to 100% for full width
//               // padding:"0 1rem",
//               // height: "225px", // Automatically adjust height based on the width
//             }}
//           />
//           <div className="" style={{ margin: "0 auto" }}>
//             <h5 style={{ margin: "1rem 0", fontSize: "1.5rem" }}>
//               {detail.name}
//             </h5>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default PersonCard;
