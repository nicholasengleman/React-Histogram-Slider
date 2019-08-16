import React from "react";
import ReactDOM from "react-dom";
import Histogram from "./Components/Histogram/Histogram";
import { data } from "./data";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Histogram barMargin={0.5} data={data} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//ToDo
//Calculate correct position of buttons on input
//fix overlay
//draw right hand scale. use flexbox for positioning and the javascript map method.
//clean up code
//create proptypes
//create demo page with 3 datasets
