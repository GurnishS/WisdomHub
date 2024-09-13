// src/App.jsx
import React from "react";
import Router from "./components/Router.jsx";
import NotificationArea from "./components/NotificationArea.jsx";
function App() {
  return (
    <div className="App">
      <Router />
      <NotificationArea />
    </div>
  );
}

export default App;
