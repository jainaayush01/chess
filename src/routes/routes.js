import React, { lazy } from "react";
import Header from "../components/Header/Header";
import styles from "../App.module.scss";
import { LiveGame } from "../components";
import { Outlet } from "react-router";
const Home = lazy(() => import("../pages/Home/Home"));
const Room = lazy(() => import("../pages/Room/Room"));
const Practice = lazy(() => import("../pages/Practice/Practice"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

export const routes = [
  /* routes with header */
  {
    path: "/",
    exact: true,
    element: <>
      <Header />
      <div className={styles.mainback}>
        <Outlet />
      </div>
    </>,
    children: [
      {
        exact: true,
        path: "/",
        element: <Home />
      },
      {
        exact: true,
        path: "/practice",
        element: <Practice />
      },
      {
        exact: true,
        path: "/game",
        element: <Room />
      },
      {
        exact: true,
        path: "/game/:gameId",
        element: <LiveGame />
      },
      {
        path: "/*",
        element: <NotFound />
      },
    ],
  },
]

export default routes;
