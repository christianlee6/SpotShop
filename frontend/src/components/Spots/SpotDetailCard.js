import React from "react";
import { Link } from "react-router-dom";
import noimage from './images/noimage.png'
import "./Spots.css";

const SpotDetailCard = ({spot}) => {

    if (!spot) return null;

    return (
        <div>
        <Link style={{ textDecoration: "none", color: "black" }} to={`/spots/${spot.id}`}>

          <div className="allspots-spot-image-container">
          {spot.previewImage ?
            (<div><img src={spot.previewImage} /></div>) :
            (<div><img src={noimage} alt="noimage" /></div>)
          }
          </div>

          <div className="allspots-spot-info">

            <div className="allspots-spot-header">
              <div className="allspots-spot-location">
                {spot.city}, {spot.state}
              </div>

              <div className="allspots-spot-rating">
                {spot.avgRating === "No average rating available" ?
                  (<span>★ New</span>):
                  (<span>★ {spot.avgRating}</span>)
                }
              </div>
            </div>
            <div className="allspots-spot-country">
              {spot.country}
            </div>
            <div className="allspots-spot-price">
              ${spot.price} <span>night</span>
            </div>
          </div>

        </Link>
      </div>
    );
};

export default SpotDetailCard;
