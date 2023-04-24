import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useRoutes } from "react-router-dom";
import { NotFound, Room, Home, Practice } from "./pages";
import { LiveGame } from "./components";
import AuthDialog from "./components/AuthModal/AuthModal";
import routes from "./routes/routes";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import { CircularProgress } from "@material-ui/core";

export const fallback = <div style={{
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  gap: 20,
  justifyContent: "center",
  alignItems: "center",
  color: "#848484",
}}>
  <h3>Loading...</h3>
  <CircularProgress />
</div>;

const App = () => {
  const [auth, setAuth] = useState(false);
  const routeRes = useRoutes(routes);

  return (
    <div className={styles.App}>
        {!auth ? (
          <>
            <AuthDialog auth={auth} setAuth={setAuth} />
          </>
        ) : (

          <Suspense fallback={fallback}>{routeRes}</Suspense>
          // <Routes>
          //   <Route exact path="/" element={<Home />} />
          //   <Route exact path="/practice" element={<Practice />} />
          //   <Route exact path="/room" element={<Room />} />
          //   <Route exact path="/home" element={<Home />} />
          //   <Route exact path="/room/:gameId" element={<LiveGame />} />
          //   <Route element={<NotFound />} />
          // </Routes>
        )}
    </div>
  );
};

export default App;
