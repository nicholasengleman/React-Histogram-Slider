import React, { Component } from "react";
import ReactDOM from "react-dom";
import Histogram from "./Components/Histogram/Histogram";
import { data } from "./data";

import "./styles.css";

class App extends Component {
    getBoundries = boundries => {
        return boundries;
    };

    render() {
        return (
            <div className="App">
                <div className="container">
                    <Histogram barMargin={0.5} data={data} getBoundries={this.getBoundries} />
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

////////////
//ToDo
/////////////
// 1. finish inputs
// 2. verify selected data matches what is displayed
// 3. create public interface with props for
//    b. changing bar with
//    c. turning off/on scale, inputs,
//    d. changing number steps on scale,
//    e. changing color of elements
//    f. changing size of buttons?
// 4. create proptypes
// 5. create demo page with 3 datasets
