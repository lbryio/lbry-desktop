import React from "react";

const LoadingScreen = ({ status }) =>
  <div className="video--loading-screen">
    <div className="video--loading-screen-content">
      <div className="video--loading-spinner" />

      <div className="video--loading-status">
        {status}
      </div>
    </div>
  </div>;

export default LoadingScreen;
