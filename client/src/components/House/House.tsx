import React from "react";

const House = () => {
  return (
    <div className="pt-1">
      <h2 className="m-0 text-center text-white">house</h2>
      <div className="text-white d-flex m-0 p-0 justify-content-center">
        <p className="rem1 text-left px-1">S:waiting</p>
      </div>
      <div className="d-flex justify-content-center">
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

export default House;