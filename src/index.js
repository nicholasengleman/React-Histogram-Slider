import React, { Component } from "react";
import ReactDOM from "react-dom";
import Histogram from "./Components/Histogram/Histogram";
import { data } from "./data.js";

import "./styles.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSet: data.dataSet1
        }
    }

    getBoundries = boundries => {
        console.log(boundries);
    };

    changeDataSet = (event) => {
        this.setState({ dataSet: data[event.target.value] });
    }

    render() {
        return (
            <div className="App">
                <div className="dataSetRow">
                    <button onClick={this.changeDataSet} value="dataSet1">Data Set #1</button>
                    <button onClick={this.changeDataSet} value="dataSet2">Data Set #2</button>
                    <button onClick={this.changeDataSet} value="dataSet3">Data Set #3</button>
                </div>
                <div className="container">
                    <Histogram barMargin={2} data={this.state.dataSet} getBoundries={this.getBoundries} />
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

