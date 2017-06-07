import React from "react";

const LoadingScreen = ({ status }) =>
  <div className="video--loading--screen">
    <div className="loading--screen--content">
      <div className="loading--spinner" />

      <div className="video--loading--status">
        {status}
      </div>
    </div>
  </div>;

export default LoadingScreen;
