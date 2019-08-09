import React, { Component } from "react";
import Slider from "./../Slider/Slider";

import { data } from "./../../data";
import "./histogram-styles.css";

class Histogram extends Component {
  constructor(props) {
    super(props);

    this.histogram = React.createRef();

    this.state = {
      normalizedData: [],
      sortedData: this.sortData(this.props.data),
      barWidth: 0,
      maxAbsValue: this.findMaxValue(this.props.data, true),
      maxValue: this.findMaxValue(this.props.data, false),
      minValue: this.findMinValue(this.props.data, false),
      leftBoundry: -1,
      rightBoundry: 0
    };
  }

  componentDidMount() {
    this.normalizeData(this.state.sortedData);
    this.setState({ rightBoundry: this.props.data.length });
    this.calculateBarWidth();
  }

  getLeftBoundry = bar => {
    this.setState({ leftBoundry: bar });
  };

  getRightBoundry = bar => {
    this.setState({ rightBoundry: bar });
  };

  sortData = data => {
    return data.sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      } else if (a.value > b.value) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  normalizeData = data => {
    //centered mode
    let normalizedData = [];
    let maxHeight = (this.histogram.current.offsetHeight - 2) / 2;

    // get normalize varaiable from maxHeight / maxValue
    let normalizedVariable = maxHeight / this.state.maxAbsValue;

    //get new data set by multiplying all data by this variable
    data.forEach(data => {
      normalizedData.push({
        ...data,
        value: normalizedVariable * data.value
      });
    });

    this.setState({ normalizedData });
  };

  calculateBarWidth = () => {
    let histogramWidth = this.histogram.current.offsetWidth - 2;
    let barWidth = histogramWidth / data.length - this.props.barMargin * 2;
    this.setState({ barWidth });
  };

  findMaxValue = (data, use_absolute = true) => {
    let max = -9999999999999999999999999999999999999;
    if (use_absolute) {
      data.forEach(data => {
        if (Math.abs(data.value) > max) {
          max = Math.abs(data.value);
        }
      });
    } else {
      data.forEach(data => {
        if (data.value > max) {
          max = data.value;
        }
      });
    }
    return max;
  };

  findMinValue = (data, use_absolute = true) => {
    let min = 99999999999999999999999999999999999999;
    if (use_absolute) {
      data.forEach(data => {
        if (Math.abs(data.value) < min) {
          min = Math.abs(data.value);
        }
      });
    } else {
      data.forEach(data => {
        if (data.value < min) {
          min = data.value;
        }
      });
    }

    return min;
  };

  render() {
    return (
      <div className="histogram-container">
        <div ref={this.histogram} className="histogram">
          {this.state.normalizedData.map((bar, index) => {
            let barMarginTop, barMarginBottom, color;

            if (bar.value > 0) {
              barMarginTop = 0;
              barMarginBottom = Math.abs(bar.value);
            } else {
              barMarginTop = Math.abs(bar.value);
              barMarginBottom = 0;
            }

            if (
              (this.state.leftBoundry < index &&
                index < this.state.rightBoundry) ||
              (this.state.leftBoundry === 0 && this.state.rightBoundry === 0)
            ) {
              if (bar.value > 0) {
                color = "green";
              } else {
                color = "red";
              }
            } else {
              color = "lightgrey";
            }

            let barHeight = Math.abs(bar.value);

            return (
              <div
                style={{
                  height: barHeight,
                  marginBottom: barMarginBottom,
                  marginTop: barMarginTop,
                  backgroundColor: color,
                  width: this.state.barWidth
                }}
                className="bar"
              />
            );
          })}
        </div>
        <Slider
          sortedData={this.state.sortedData}
          getLeftBoundry={this.getLeftBoundry}
          getRightBoundry={this.getRightBoundry}
        />
        <div className="total">
        {Math.abs(this.state.leftBoundry - this.state.rightBoundry - 1)} cryptos
        </div>
      </div>
    );
  }
}

export default Histogram;
