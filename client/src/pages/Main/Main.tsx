import React from "react";
// components
import Round from "../../components/Round/Round";
import House from "../../components/House/House";
import Player from "../../components/Player/Player";

const Main = () => {
  return (
    <main>
      <Round />
      <House />
      <div
        id="playersDiv"
        className="d-flex justify-content-center flex-row w-100"
      >
        <Player />
        <Player />
        <Player />
      </div>
    </main>
  );
};

export default Main;
