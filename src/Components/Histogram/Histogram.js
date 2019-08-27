import React, { Component } from "react";
import Slider from "./../Slider/Slider";
import Bar from "./Bar/Bar";

import "./histogram-styles.css";

const defaultProps = {
    barMargin: 0.5,
    data: [
        {
            value: 1
        },
        {
            value: 2
        },
        {
            value: -3
        },
        {
            value: 1
        },
        {
            value: 2
        },
        {
            value: -10
        },
        {
            value: 11
        },
        {
            value: -5
        },
        {
            value: 7
        }
    ],
    getBoundries: function () {
        return this.barMinIndex;
    }
};

class Histogram extends Component {
    constructor(props) {
        super(props);

        this.histogram = React.createRef();

        for (let e = 0; e < this.props.data.length; e++) {
            this.ref = {
                ...this.ref,
                [`ref_${e}`]: React.createRef()
            }
        }

        this.state = {
            normalizedData: [],
            barWidth: 0.5,
            computedBarWidth: 0,
            dataSetMinValue: 0,
            dataSetMaxValue: 0,
            barMin: 0,
            barMax: 0,
            sliderBarWidth: 0,
            sliderContainerLeftPosition: 0,
            sliderContainerRightPosition: 0,
            inputFocus: false,
            leftInputValue: 0,
            rightInputValue: 0,
        };

        this.leftButtonAdjustment = 50;
        this.rightButtonAdjustment = -25;
        this.barMinIndex = 0;
        this.barMaxIndex = 0;
        this.barLocations = [];
    }

    componentDidMount() {
        this.setState(
            {
                dataSetMinValue: this.findMinValue(this.props.data),
                dataSetMaxValue: this.findMaxValue(this.props.data)
            },
            () => this.normalizeData(this.props.data)
        );
        this.calculateBarWidth(this.props.data);
        console.log(this.barLocations);

        //window.addEventListener("resize", this.calculateBarWidth());
    }

    componentDidUpdate(prevProps) {
        if (this.barLocations.length === 0) {
            for (let ref in this.ref) {
                if (this.ref[ref].current) {
                    this.barLocations.push(this.ref[ref].current.offsetLeft);
                }
            }
            if (this.ref.ref_0.current) {
                this.setState({ computedBarWidth: this.ref.ref_0.current.offsetWidth })
            }
        }

        if (prevProps.data !== this.props.data) {
            this.calculateBarWidth(this.props.data);
            this.setState(
                {
                    dataSetMinValue: this.findMinValue(this.props.data),
                    dataSetMaxValue: this.findMaxValue(this.props.data)
                },
                () => this.normalizeData(this.props.data)
            );
        }
    }


    normalizeData = data => {
        let normalizedData = [], normalizedValue;

        //sort the data
        let sortedData = data.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            } else {
                return 0;
            }
        });


        //normalize the data
        if ((this.state.dataSetMinValue) < 0) {
            console.log(this.histogram.current.offsetHeight);
            normalizedValue = (this.histogram.current.offsetHeight - 2) / (Math.abs(this.state.dataSetMaxValue) + Math.abs(this.state.dataSetMinValue));
        } else {
            normalizedValue = (this.histogram.current.offsetHeight - 2) / Math.abs(this.state.dataSetMaxValue);
        }


        sortedData.forEach(data => {
            normalizedData.push({
                ...data,
                normalizedValue: normalizedValue * data.value
            });
        });

        this.setState({ normalizedData });
    };

    //////////////////////////////////////
    // Utility Functions
    ///////////////////////////////////
    calculateBarWidth = data => {
        let histogramWidth = this.histogram.current.offsetWidth - 2;
        let barWidth =
            histogramWidth / this.props.data.length - this.props.barMargin * 2;
        this.setState({ barWidth });
    };

    findMaxValue = data => {
        let max = -9999999999999999999999999999999999999;
        data.forEach(data => {
            if (data.value > max) {
                max = data.value;
            }
        });
        return max;
    };

    findMinValue = data => {
        let min = 99999999999999999999999999999999999999;
        data.forEach(data => {
            if (data.value < min) {
                min = data.value;
            }
        });
        return min;
    };

    getSliderBarDimensions = (
        sliderBarWidth,
        sliderContainerRightPosition,
        sliderContainerLeftPosition
    ) => {
        this.setState({
            sliderBarWidth,
            sliderContainerRightPosition,
            sliderContainerLeftPosition,
            barMax: sliderBarWidth - 25
        });
    };

    /////////////////////////////////////////////
    //  Functions for handling state change via input boxes
    ///////////////////////////////////////////////
    handleInputFocus = e => {
        let name;
        if (e.target) {
            name = e.target.name;
        } else {
            name = "";
        }
        this.setState(prevState => ({
            inputFocus: !prevState.inputFocus,
            input_with_focus: name
        }));
    };

    findLeftBarFromInput = e => {
        this.setState({ leftInputValue: e.target.value });

        let index = this.state.normalizedData.findIndex(el => {
            return el.value >= e.target.value;
        });

        this.setState({ barMin: this.barLocations[index] });
    };

    findRightBarFromInput = e => {
        let index = 0;
        this.setState({ rightInputValue: e.target.value });
        for (let i = this.state.normalizedData.length - 1; i > 0; i--) {
            if (this.state.normalizedData[i].value <= e.target.value) {
                index = i;
                break;
            }
        }
        this.setState({ barMax: this.barLocations[index] });
    };


    /////////////////////////////////////////////
    // sets position_min and position_max from mouse movement
    //////////////////////////////////////////////
    findInputValueFromButtonLocation = (button_location, bar_id) => {
        let index = 0;
        if (bar_id === "Min") {
            index = this.barLocations.findIndex(el => {
                return button_location - 25 <= el;
            });
            if (index > 0) {
                index = index - 1;
                this.barMinIndex = index - 1;
            } else {
                this.barMinIndex = index;
            }
        } else {
            for (let i = this.barLocations.length; i > 0; i--) {
                if (button_location - 25 > this.barLocations[i]) {
                    index = i;
                    this.barMaxIndex = i;
                    break;
                }
            }
        }

        if (this.state.normalizedData[index]) {
            return this.state.normalizedData[index].value;
        } else {
            return this.state.normalizedData[this.state.normalizedData.length - 1].value;
        }
    };

    handleButtonMovement = ({ clientX }, btn_id) => {
        if (this.state.normalizedData.length > 0) {
            if (this.state.sliderContainerLeftPosition + 12.5 < clientX && clientX < this.state.sliderContainerRightPosition - 12.5) {

                if (btn_id === "Min") {
                    this.setState({
                        barMin: clientX - this.state.sliderContainerLeftPosition - 12.5,
                        leftInputValue: this.findInputValueFromButtonLocation(clientX - this.state.sliderContainerLeftPosition, btn_id)
                    });
                } else {
                    this.setState({
                        barMax: clientX - this.state.sliderContainerLeftPosition - 12.5,
                        rightInputValue: this.findInputValueFromButtonLocation(clientX - this.state.sliderContainerLeftPosition, btn_id)
                    });
                }

            } else if (clientX < this.state.sliderContainerLeftPosition + 12.5) {
                this.setState({ [`bar${btn_id}`]: 0 });
            } else if (this.state.sliderContainerRightPosition - 12.5 < clientX) {
                this.setState({
                    [`bar${btn_id}`]: this.state.sliderBarWidth - 25
                });
            }
        }
    };


    render() {
        let scaleStep =
            (parseInt(this.state.dataSetMaxValue) - parseInt(this.state.dataSetMinValue)) / 4;
        let scaleSteps = [parseInt(this.state.dataSetMinValue)];
        for (let i = 1; i <= 4; i++) {
            scaleSteps.push(parseInt(scaleSteps[i - 1] + scaleStep));
        }
        return (
            <div className="histogram-container">
                <div className="scale-container">
                    {scaleSteps.map(step => {
                        return (
                            <div key={Math.random()} className="scale-step">
                                {step}%
                            </div>
                        );
                    })}
                </div>
                <div ref={this.histogram} className="histogram">
                    <div className="bar-container">
                        {this.state.normalizedData.map((bar, index) => {

                            let barMarginTop, barMarginBottom, color, barHeight;
                            if (bar.normalizedValue > 0) {
                                barMarginTop = 0;
                                barMarginBottom = Math.abs(bar.normalizedValue);
                            } else {
                                barMarginTop = Math.abs(bar.normalizedValue);
                                barMarginBottom = 0;
                            }

                            if ((this.state.barMin <= (this.barLocations[index] + 25 - 6.25) &&
                                (this.barLocations[index] + 25 - 6.25) <= this.state.barMax - this.state.computedBarWidth) || (this.barLocations.length === 0)) {
                                if (bar.normalizedValue > 0) {
                                    color = "green";
                                } else {
                                    color = "red";
                                }
                            } else {
                                color = "lightgrey";
                            }

                            if (Math.abs(bar.normalizedValue) < 1) {
                                barHeight = 1;
                            } else {
                                barHeight = Math.abs(bar.normalizedValue);
                            }

                            return (
                                <Bar
                                    key={index}
                                    height={barHeight}
                                    marginBottom={barMarginBottom}
                                    marginTop={barMarginTop}
                                    backgroundColor={color}
                                    width={this.state.barWidth}
                                    ref={this.ref[`ref_${index}`]}
                                    directionalClass={color === "green" ? "positiveBar" : "negativeBar"}
                                    tooltip={bar.tooltip}
                                />
                            );
                        })}
                    </div>
                </div>
                <Slider
                    getSliderBarDimensions={this.getSliderBarDimensions}
                    sliderBarWidth={this.state.sliderBarWidth}
                    sliderContainerLeftPosition={this.state.sliderContainerLeftPosition}
                    sliderContainerRightPosition={this.state.sliderContainerRightPosition}
                    handleButtonMovement={this.handleButtonMovement}
                    buttonLeft={this.state.barMin}
                    buttonRight={this.state.barMax}
                />
                <div className="input-section">
                    <div
                        className={`input-container ${
                            this.state.input_with_focus === "left_boundry" ? "selected" : ""
                            }`}
                    >
                        <input
                            name="left_boundry"
                            min="-999"
                            max="999"
                            onChange={e => this.findLeftBarFromInput(e)}
                            onFocus={this.handleInputFocus}
                            onBlur={this.handleInputFocus}
                            value={
                                !this.state.inputFocus
                                    ? parseInt(this.state.leftInputValue)
                                    : null
                            }
                            type="number"
                        />
                        %
                    </div>
                    to
                    <div
                        className={`input-container ${
                            this.state.input_with_focus === "right_boundry" ? "selected" : ""
                            }`}
                    >
                        <input
                            name="right_boundry"
                            min="-999"
                            max="999"
                            onChange={e => this.findRightBarFromInput(e)}
                            onFocus={this.handleInputFocus}
                            onBlur={this.handleInputFocus}
                            value={
                                !this.state.inputFocus
                                    ? parseInt(this.state.rightInputValue)
                                    : null
                            }
                            type="number"
                        />
                        %
                    </div>
                </div>
            </div>
        );
    }
}

Histogram.defaultProps = defaultProps;

export default Histogram;
