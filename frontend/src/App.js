import "@fontsource/montserrat";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as spotsActions from "./store/spots"
import Navigation from "./components/Navigation";

import Spots from "./components/Spots"
import LoadSingleSpot from "./components/Spots/SingleSpot";
import CreateSpotForm from "./components/Spots/CreateSpotForm";
import LoadUserSpots from "./components/Spots/LoadUserSpots";
import EditSpotForm from "./components/Spots/EditSpotForm";
import LoadUserReviews from "./components/Reviews/LoadUserReviews";
import CreateReview from "./components/Reviews/CreateReview";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("log")
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
            <Route exact path="/">
                <Spots />
            </Route>

            <Route exact path='/spots/:spotId'>
                <LoadSingleSpot isLoaded={isLoaded}/>
            </Route>

            <Route exact path="/spots/:spotId/create-review">
                <CreateReview />
            </Route>

            <Route path="/myspots/edit/:spotId">
                <EditSpotForm />
            </Route>

            <Route exact path="/new">
                <CreateSpotForm />
            </Route>

            <Route exact path='/myspots'>
                <LoadUserSpots />
            </Route>

            <Route exact path="/myreviews">
                <LoadUserReviews />
            </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
