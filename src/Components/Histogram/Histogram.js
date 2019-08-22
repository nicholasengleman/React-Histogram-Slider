import React, { Component } from "react";
import Slider from "./Slider/Slider";

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
    getBoundries: function(s) {
        //console.log(s);
    }
};

class Histogram extends Component {
    constructor(props) {
        super(props);

        this.histogram = React.createRef();

        this.state = {
            normalizedData: [],
            barWidth: 0.5,
            maxValue: 0,
            minValue: 0,
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

        this.leftButtonAdjustment = 50;
        this.rightButtonAdjustment = -25;
    }

    componentDidMount() {
        this.setState(
            {
                maxValue: this.findMaxValue(this.props.data),
                minValue: this.findMinValue(this.props.data)
            },
            () => this.normalizeData(this.props.data)
        );
        this.setState({ rightBoundry: this.props.data.length - 1 });
        this.calculateBarWidth(this.props.data);

        //window.addEventListener("resize", this.calculateBarWidth());
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.calculateBarWidth(this.props.data);
            this.setState(
                {
                    maxValue: this.findMaxValue(this.props.data),
                    minValue: this.findMinValue(this.props.data)
                },
                () => this.normalizeData(this.props.data)
            );
        }
    }
    normalizeData = data => {
        let normalizedData = [];

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
        let normalizedValue =
            (this.histogram.current.offsetHeight - 2) /
            (Math.abs(this.state.maxValue) + Math.abs(this.state.minValue));

        sortedData.forEach(data => {
            normalizedData.push({
                ...data,
                value: normalizedValue * data.value
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
            sliderContainerLeftPosition
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
        let leftBoundry = this.state.normalizedData.findIndex(el => {
            return el.value >= e.target.value;
        });

        //   this.props.getBoundries({ "leftBoundry" : leftBoundry, "rightBoundry": this.state.rightBoundry});
        this.setState({ leftBoundry }, () =>
            this.calculateClientXFromBoundry(leftBoundry, "button_left")
        );
    };

    findRightBarFromInput = e => {
        let rightBoundry = 0;
        this.setState({ rightInputValue: e.target.value });
        for (let i = this.state.normalizedData.length - 1; i > 0; i--) {
            if (this.state.normalizedData[i].value <= e.target.value) {
                rightBoundry = i;
                break;
            }
        }
        //   this.props.getBoundries({ "leftBoundry" : this.state.leftBoundry, "rightBoundry": rightBoundry});
        this.setState({ rightBoundry }, () =>
            this.calculateClientXFromBoundry(rightBoundry, "button_right")
        );
    };

    calculateClientXFromBoundry = (boundry, btn) => {
        let percentageShrink = 0.9;
        let shrunkSliderBarWidth = this.state.sliderBarWidth * percentageShrink;
        let endBuffer = (this.state.sliderBarWidth - shrunkSliderBarWidth) / 2;

        let clientX =
            (boundry / (this.props.data.length - 1)) * shrunkSliderBarWidth +
            endBuffer +
            this.state.sliderContainerLeftPosition;
        if (btn === "button_left") {
            clientX = clientX - 30;
        } else {
            clientX = clientX + 30;
        }
        this.calculateTranslateX({ clientX }, btn);
    };

    ///////////////////////////////////////////////////////////////////////////////////
    ////   Core Functions
    ///////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////
    // Finds Left and Right "Boundries" in histogram based off position of sliders
    //////////////////////////////////////////////
    findCurrentBar = (translateX, buttonAdjustment) => {
        translateX = translateX + buttonAdjustment;

        //resizes histogram computations to be less wide than slider
        let percentageShrink = 0.9;
        let shrunkSliderBarWidth = this.state.sliderBarWidth * percentageShrink;
        let endBuffer = (this.state.sliderBarWidth - shrunkSliderBarWidth) / 2;
        let shrunkAbsoluteDistanceTravelled = translateX - endBuffer;
        let percentageTravelled =
            shrunkAbsoluteDistanceTravelled / shrunkSliderBarWidth;

        if (percentageTravelled > 0 && percentageTravelled < 1) {
            return Math.floor(this.state.normalizedData.length * percentageTravelled);
        } else if (percentageTravelled <= 0) {
            return 0;
        } else if (percentageTravelled >= 1) {
            return this.state.normalizedData.length - 1;
        }
    };

    /////////////////////////////////////////////
    // Calculates Position of buttons from mouse movement(the clientX)
    //////////////////////////////////////////////
    calculateTranslateX = ({ clientX }, btn_id) => {
        if (
            this.state.sliderContainerLeftPosition + 12.5 < clientX &&
            clientX < this.state.sliderContainerRightPosition - 12.5
        ) {
            this.setState({
                [`translateX_${btn_id}`]:
                clientX - this.state.sliderContainerLeftPosition - 12.5
            });
        } else if (clientX < this.state.sliderContainerLeftPosition + 12.5) {
            this.setState({ [`translateX_${btn_id}`]: 0 });
        } else if (this.state.sliderContainerRightPosition - 12.5 < clientX) {
            this.setState({
                [`translateX_${btn_id}`]:
                this.state.sliderContainerRightPosition -
                this.state.sliderContainerLeftPosition -
                25
            });
        }
    };

    /////////////////////////////////////////////
    // Function passed to the button component to:
    //  1. call the calculateTranslateX function to calculate the position of the buttons from the mouse movement
    //  2. call the findCurrentbar function to calculate the selected bars in the histogram based off the position of the buttons
    //////////////////////////////////////////////
    handleCalculateTranslateX = ({ clientX }, btn_id) => {
        if (this.state.normalizedData.length > 0) {
            this.calculateTranslateX({ clientX }, btn_id);
            if (btn_id === "button_left") {
                let leftCurrentBar = this.findCurrentBar(
                    this.state[`translateX_${btn_id}`],
                    this.leftButtonAdjustment
                );
                this.props.getBoundries({
                    leftBoundry: leftCurrentBar,
                    rightBoundry: this.state.rightBoundry
                });
                this.setState({
                    leftBoundry: leftCurrentBar,
                    leftInputValue: this.state.normalizedData[leftCurrentBar].value
                });
            } else {
                let rightCurrentBar = this.findCurrentBar(
                    this.state[`translateX_${btn_id}`],
                    this.rightButtonAdjustment
                );
                this.props.getBoundries({
                    leftBoundry: this.state.leftBoundry,
                    rightBoundry: rightCurrentBar
                });
                this.setState({
                    rightBoundry: rightCurrentBar,
                    rightInputValue: this.state.normalizedData[rightCurrentBar].value
                });
            }
        }
    };

    render() {
        let scaleStep =
            (parseInt(this.state.maxValue) - parseInt(this.state.minValue)) / 4;
        let scaleSteps = [parseInt(this.state.minValue)];
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
                            if (bar.value > 0) {
                                barMarginTop = 0;
                                barMarginBottom = Math.abs(bar.value);
                            } else {
                                barMarginTop = Math.abs(bar.value);
                                barMarginBottom = 0;
                            }

                            if (
                                (this.state.leftBoundry <= index &&
                                    index <= this.state.rightBoundry) ||
                                (this.state.leftBoundry === 0 && this.state.rightBoundry === -1)
                            ) {
                                if (bar.value > 0) {
                                    color = "green";
                                } else {
                                    color = "red";
                                }
                            } else {
                                color = "lightgrey";
                            }

                            if (Math.abs(bar.value) < 1) {
                                barHeight = 1;
                            } else {
                                barHeight = Math.abs(bar.value);
                            }

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
                </div>
                <Slider
                    getSliderBarDimensions={this.getSliderBarDimensions}
                    sliderBarWidth={this.state.sliderBarWidth}
                    sliderContainerLeftPosition={this.state.sliderContainerLeftPosition}
                    sliderContainerRightPosition={this.state.sliderContainerRightPosition}
                    handleCalculateTranslateX={this.handleCalculateTranslateX}
                    translateXLeft={this.state.translateX_button_left}
                    translateXRight={this.state.translateX_button_right}
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
