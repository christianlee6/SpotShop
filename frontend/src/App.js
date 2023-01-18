import "@fontsource/montserrat";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import * as spotsActions from "./store/spots"
import Navigation from "./components/Navigation";

import Spots from "./components/Spots"
import SingleSpot from "./components/Spots/SingleSpot/SingleSpot";
import CreateSpotForm from "./components/Spots/CreateSpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(spotsActions.getAllSpots());
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
            <Route exact path="/">
                <Spots />
            </Route>

            <Route path='/spots/:id'>
                <SingleSpot isLoaded={isLoaded}/>
            </Route>

            <Route path="/new">
                <CreateSpotForm />
            </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
