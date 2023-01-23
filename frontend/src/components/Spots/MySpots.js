// import { Link, useHistory } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     deleteSpotThunk, getSpotsOfUserThunk
// } from "../../store/spots";

// import noimage from "./images/noimage.png";
// import { useEffect } from "react";

// const MySpots = ({ spot }) => {
//     const dispatch = useDispatch();
//     const history = useHistory();

//     const sessionUser = useSelector(state => state.session.user);
//     let isOwner = false;


//     if (sessionUser?.id === spot.ownerId) isOwner = true;
//     if (!sessionUser) return null


//     const deleteHandleClick = async () => {
//         if (
//             window.confirm(
//                 "Are you sure you want to delete this spot? This action is irreversible."
//             )
//         ) {
//             dispatch(deleteSpotThunk(Number(spot.id)));
//         }
//     };

//     const editHandleClick = async () => {
//         history.push(`/myspots/edit/${spot.id}`);
//     };


//     return (
//         <div>
//             <Link
//                 style={{ textDecoration: "none", color: "black" }}
//                 to={`/spots/${spot.id}`}
//             >
//                 <div className="allspots-spot-image-container">
//                     {spot.previewImage ? (
//                         <div>
//                             <img src={spot.previewImage} />
//                         </div>
//                     ) : (
//                         <div>
//                             <img src={noimage} alt="noimage" />
//                         </div>
//                     )}
//                 </div>

//                 <div className="allspots-spot-info">
//                     <div className="allspots-spot-header">
//                         <div className="allspots-spot-location">
//                             {spot.city}, {spot.state}
//                         </div>

//                         <div className="allspots-spot-rating">
//                             {Number(spot.avgRating) ? (
//                                 <span>★ {spot.avgRating}</span>
//                             ) : (
//                                 <span>★ None</span>
//                             )}
//                         </div>
//                     </div>
//                     <div className="allspots-spot-country">{spot.country}</div>
//                     <div className="allspots-spot-price">
//                         ${spot.price} <span>night</span>
//                     </div>
//                 </div>
//             </Link>

//                 <div className="myspots-buttons-container">
//                     {(
//                         <>
//                             <button className="myspots-buttons" onClick={editHandleClick}>
//                                 Edit Spot
//                             </button>

//                             <button className="myspots-buttons" onClick={deleteHandleClick}>
//                             Delete Spot
//                             </button>
//                         </>
//                     )}
//                 </div>

//         </div>
//     );
// };

// export default MySpots
