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
            leftBoundry: 0,
            rightBoundry: 0,
            sliderBarWidth: 0,
            sliderContainerLeftPosition: 0,
            sliderContainerRightPosition: 0,
            translateX_button_right: 0,
            translateX_button_left: 0,
            inputFocus: false,
            leftInputValue: 0,
            rightInputValue: 0
        };

        this.leftButtonAdjustment = 25;
        this.rightButtonAdjustment = 0;
    }

    componentDidMount() {
        this.normalizeData(this.state.sortedData);
        this.setState({ rightBoundry: this.props.data.length - 1 });
        this.calculateBarWidth();
        //window.addEventListener("resize", this.calculateBarWidth());
    }

    getSliderBarDimensions = (sliderBarWidth, sliderContainerRightPosition, sliderContainerLeftPosition) => {
        this.setState({
            sliderBarWidth,
            sliderContainerRightPosition,
            sliderContainerLeftPosition
        });
    };

    findLeftBarFromInput = e => {
        this.setState({ leftInputValue: e.target.value });
        let leftBoundry = this.state.sortedData.findIndex(el => {
            return el.value >= e.target.value;
        });
        this.setState({ leftBoundry }, () => this.calculateClientXFromBoundry(leftBoundry, "button_left"));
    };

    findRightBarFromInput = e => {
        let rightBoundry = 0;
        this.setState({ rightInputValue: e.target.value });
        for (let i = this.state.sortedData.length - 1; i > 0; i--) {
            if (this.state.sortedData[i].value <= e.target.value) {
                rightBoundry = i;
                break;
            }
        }
        this.setState({ rightBoundry }, () => this.calculateClientXFromBoundry(rightBoundry, "button_right"));
    };

    calculateClientXFromBoundry = (boundry, btn) => {
        let percentageShrink = 0.9;
        let shrunkSliderBarWidth = this.state.sliderBarWidth * percentageShrink;
        let endBuffer = (this.state.sliderBarWidth - shrunkSliderBarWidth) / 2;

        let clientX =
            (boundry / this.props.data.length) * shrunkSliderBarWidth +
            endBuffer +
            this.state.sliderContainerLeftPosition;
        this.calculateTranslateX({ clientX }, btn);
    };

    findCurrentBar = (translateX, buttonAdjustment) => {
        translateX = translateX + buttonAdjustment;

        //resizes histogram computations to be less wide than slider
        let percentageShrink = 0.9;
        let shrunkSliderBarWidth = this.state.sliderBarWidth * percentageShrink;
        let endBuffer = (this.state.sliderBarWidth - shrunkSliderBarWidth) / 2;
        let shrunkAbsoluteDistanceTravelled = translateX - endBuffer;
        let percentageTravelled = shrunkAbsoluteDistanceTravelled / shrunkSliderBarWidth;

        if (percentageTravelled > 0 && percentageTravelled < 1) {
            return Math.floor(this.state.sortedData.length * percentageTravelled);
        } else if (percentageTravelled <= 0) {
            return 0;
        } else if (percentageTravelled >= 1) {
            return this.state.sortedData.length - 1;
        }
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

    handleInputFocus = () => {
        this.setState(prevState => ({
            inputFocus: !prevState.inputFocus
        }));
    };

    calculateTranslateX = ({ clientX }, btn_id) => {
        //calculates position of buttons
        if (this.state.sliderContainerLeftPosition < clientX && clientX < this.state.sliderContainerRightPosition) {
            this.setState({
                [`translateX_${btn_id}`]: clientX - this.state.sliderContainerLeftPosition
            });
        } else if (clientX < this.state.sliderContainerLeftPosition) {
            this.setState({ [`translateX_${btn_id}`]: 0 });
        } else if (this.state.sliderContainerRightPosition < clientX) {
            this.setState({
                [`translateX_${btn_id}`]:
                    this.state.sliderContainerRightPosition - this.state.sliderContainerLeftPosition
            });
        }
    };

    handleCalculateTranslateX = ({ clientX }, btn_id) => {
        //calculates position of left and right boundaries in histogram and input values

        this.calculateTranslateX({ clientX }, btn_id);

        if (btn_id === "button_left") {
            let leftCurrentBar = this.findCurrentBar(this.state[`translateX_${btn_id}`], this.leftButtonAdjustment);
            this.setState({
                leftBoundry: leftCurrentBar,
                leftInputValue: this.state.sortedData[leftCurrentBar].value
            });
        } else {
            let rightCurrentBar = this.findCurrentBar(this.state[`translateX_${btn_id}`], this.rightButtonAdjustment);
            this.setState({
                rightBoundry: rightCurrentBar,
                rightInputValue: this.state.sortedData[rightCurrentBar].value
            });
        }
    };

    render() {
        let scaleStep = (this.state.maxValue - this.state.minValue) / 10;
        let scaleSteps = [this.state.minValue];
        for (let i = 1; i <= 10; i++) {
            scaleSteps.push(scaleSteps[i - 1] + scaleStep);
        }
        return (
            <div className="histogram-container">
                <div className="scale-container">
                    {scaleSteps.map(step => {
                        return <div className="scale-step">{step}%</div>;
                    })}
                </div>
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
                            (this.state.leftBoundry <= index && index <= this.state.rightBoundry) ||
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
                                key={index}
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
                    getSliderBarDimensions={this.getSliderBarDimensions}
                    leftButtonAdjustment={this.leftButtonAdjustment}
                    rightButtonAdjustment={this.rightButtonAdjustment}
                    handleCalculateTranslateX={this.handleCalculateTranslateX}
                    sliderBarWidth={this.state.sliderBarWidth}
                    sliderContainerLeftPosition={this.state.sliderContainerLeftPosition}
                    sliderContainerRightPosition={this.state.sliderContainerRightPosition}
                    translateXLeft={this.state.translateX_button_left}
                    translateXRight={this.state.translateX_button_right - this.rightButtonAdjustment}
                />
                <div className="inputs">
                    <input
                        onChange={e => this.findLeftBarFromInput(e)}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputFocus}
                        value={!this.state.inputFocus ? this.state.leftInputValue : null}
                        type="number"
                    />
                    <input
                        onChange={e => this.findRightBarFromInput(e)}
                        onFocus={this.handleInputFocus}
                        onBlur={this.handleInputFocus}
                        value={!this.state.inputFocus ? this.state.rightInputValue : null}
                        type="number"
                    />
                </div>
            </div>
        );
    }
}

export default Histogram;
