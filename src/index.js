import React, { Component } from "react";
import ReactDOM from "react-dom";
import Histogram from "./Components/Histogram/Histogram";
import { data } from "./data.js";

import "./styles.css";

class App extends Component {
    getBoundries = boundries => {
        console.log(boundries);
    };

    render() {
        return (
            <div className="App">
                <div className="container">
                    <Histogram barMargin={2} data={data} getBoundries={this.getBoundries}/>
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

