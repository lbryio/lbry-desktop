import React from "react";

const LoadingScreen = ({ status }) =>
  <div className="video--loading--screen">
    <div className="loading--spinner" />

    <div className="video--loading--status">
      {status}
    </div>
  </div>;

export default LoadingScreen;
