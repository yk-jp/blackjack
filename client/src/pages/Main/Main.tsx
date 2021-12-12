import React, { useEffect } from "react";
// components
import Round from "../../components/Round/Round";
import House from "../../components/House/House";
import Player from "../../components/Player/Player";
// dependencies
import axios from "axios";
// types
import type ITable from "../../interfaces/ITable";
const Main = () => {
  useEffect(() => {
    axios.get("http://localhost:5000/").then(function (response) {
      // handle success
      const table:ITable = response.data;
      console.log(table.deck);
    });
  }, []);

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
