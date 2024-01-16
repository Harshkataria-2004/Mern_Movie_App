import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div style={{backgroundColor:"#F9F9F9"}}>
      <footer className="container py-5">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            <small className="d-block mb-3 text-muted">&copy; 2017-2024</small>
            <img src="./camera.png" alt="Brand Logo" style={{width:"3rem",height:"3rem"}} />
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            <h5>Resources</h5>
            <ul className="list-unstyled text-small">
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  Resource
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  Resource nLinkme
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  Linknother resource
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  FinLinkl resource
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            <h5>Resources</h5>
            <ul className="list-unstyled text-small">
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  Business
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  EducLinktion
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  Government
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  GLinkming
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            <h5>Linkbout</h5>
            <ul className="list-unstyled text-small">
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  TeLinkm
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  LocLinktions
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  PrivLinkcy
                </Link>
              </li>
              <li>
                <Link className="text-muted" to="#" style={{textDecoration:"none"}}>
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
