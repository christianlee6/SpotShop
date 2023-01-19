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

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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

            <Route path='/spots/:spotId'>
                <LoadSingleSpot isLoaded={isLoaded}/>
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

        </Switch>
      )}
    </>
  );
}

export default App;
