import React from "react";

const Player = () => {
  return (
    <div className="d-flex flex-column col">
      <h2 className="m-0 text-white text-center">re</h2>
      <div className="text-white d-flex justify-content-center">
        <p className="rem1 text-left px-1">S:bet </p>
        <p className="rem1 text-left px-1">B:0 </p>
        <p className="rem1 text-left px-1">C:400 </p>
      </div>
      {/* cards container */}
      <div className="d-flex justify-content-center flex-wrap">
        {/* card */}
        <div className="d-flex flex-column bg-white border mx-2">
          <div className="text-center">
            <img
              src="https://recursionist.io/img/questionMark.png"
              alt=""
              width="50"
              height="50"
            />
          </div>
          <div className="text-center">
            <p className="m-0 text-dark">?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
