import React from "react";

const LoadingScreen = ({ status }) =>
  <div className="video__loading-screen">
    <div>
      <div className="video__loading-spinner" />

      <div className="video__loading-status">
        {status}
      </div>
    </div>
  </div>;

export default LoadingScreen;
