import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "./Slider/Slider";
import Bar from "./Bar/Bar";
import _ from "lodash";

import "./histogram-styles.scss";

const defaultProps = {
    barWidthPercentage: 0.7,
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
    getBoundries: function(e) {},
    showSlider: true,
    showInputs: true,
    scaleIncrements: 5
};

class Histogram extends Component {
    constructor(props) {
        super(props);

        this.histogram = React.createRef();
        this.calculateBarWidth = _.throttle(
            this.calculateBarWidth.bind(this),
            200
        );

        this.state = {
            data: [],
            normalizedData: [],

            barWidth: 0.5,

            barMinLocation: 0,
            barMaxLocation: 0,

            sliderContainerWidth: 0,
            sliderContainerLeftPosition: 0,
            sliderContainerRightPosition: 0,

            inputFocus: false,
            leftInputValue: 0,
            rightInputValue: 0,

            barLocations: {},

            dataSetMinValue: 0,
            dataSetMaxValue: 0,
            initialRender: true
        };

        this.buttonWidth = 25.125;
        this.leftButtonAdjustment = 50;
        this.rightButtonAdjustment = -this.buttonWidth;
    }

    componentWillMount() {
        const { data } = this.props;
        this.setState({
            dataSetMinValue: this.findMinValue(data),
            dataSetMaxValue: this.findMaxValue(data)
        });
    }

    componentDidMount() {
        const { data } = this.props;
        this.normalizeData(data);
        this.calculateBarWidth(data);

        window.addEventListener("resize", () => {
            this.calculateBarWidth();
        });
    }

    componentDidUpdate(prevProps) {
        const { data, buttonPresets } = this.props;
        const {
            initialRender,
            barMinLocation,
            barMaxLocation,
            sliderContainerWidth
        } = this.state;

        if (!_.isEqual(prevProps.data, data)) {
            this.calculateBarWidth(data);
            this.setState(
                {
                    dataSetMinValue: this.findMinValue(data),
                    dataSetMaxValue: this.findMaxValue(data)
                },
                () => this.normalizeData(data)
            );
            if (!buttonPresets && initialRender) {
                if (barMinLocation !== 0) {
                    this.setState({
                        barMinLocation: 0,
                        initialRender: false
                    });
                }
                if (
                    barMaxLocation !==
                    sliderContainerWidth - this.buttonWidth
                ) {
                    this.setState({
                        barMaxLocation: sliderContainerWidth - this.buttonWidth,
                        initialRender: false
                    });
                }
            }
        }
    }

    setBarLocation = (bar, location) => {
        this.setState(prevState => ({
            barLocations: {
                ...prevState.barLocations,
                [bar]: location
            }
        }));
    };

    getBoundries = () => {
        let selection = {
            selectionMin: parseFloat(this.state.leftInputValue),
            selectionMax: parseFloat(this.state.rightInputValue)
        };
        this.props.getBoundries(selection);
    };

    normalizeData = data => {
        const { dataSetMinValue, dataSetMaxValue } = this.state;

        let normalizedData = [],
            normalizedValue;

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
        if (dataSetMinValue < 0 && dataSetMaxValue > 0) {
            normalizedValue =
                (this.histogram.current.offsetHeight - 2) /
                (Math.abs(dataSetMaxValue) + Math.abs(dataSetMinValue));
        } else if (dataSetMinValue > 0) {
            normalizedValue =
                (this.histogram.current.offsetHeight - 2) /
                Math.abs(dataSetMaxValue);
        } else if (dataSetMaxValue < 0) {
            normalizedValue =
                (this.histogram.current.offsetHeight - 2) /
                Math.abs(dataSetMinValue);
        }

        sortedData.forEach(data => {
            normalizedData.push({
                ...data,
                normalizedValue: normalizedValue * data.value
            });
        });

        this.setState(
            {
                normalizedData,
                leftInputValue: normalizedData[0].value,
                rightInputValue: normalizedData[normalizedData.length - 1].value
            },
            () => this.checkForPresetValues()
        );
    };

    checkForPresetValues = () => {
        const { buttonPresets } = this.props;
        if (buttonPresets) {
            this.setState({
                leftInputValue: buttonPresets.selectionMin,
                rightInputValue: buttonPresets.selectionMax
            });

            const setBarLocations = () => {
                this.findLeftBarFromInput(Number(buttonPresets.selectionMin));
                this.findRightBarFromInput(Number(buttonPresets.selectionMax));
            };

            if (Object.keys(this.state.barLocations).length === 0) {
                let interval = setInterval(() => {
                    if (this.state.barLocations) {
                        setBarLocations();
                        clearInterval(interval);
                    }
                }, 5);
            } else {
                setBarLocations();
            }
        }
    };

    //////////////////////////////////////
    // Utility Functions
    ///////////////////////////////////
    calculateBarWidth = () => {
        const { data, barWidthPercentage } = this.props;
        let histogramWidth = this.histogram.current
            ? this.histogram.current.offsetWidth - 2
            : 800 - 2;
        let barWidth = Math.floor(
            (histogramWidth / data.length) * barWidthPercentage
        );
        if (barWidth < 3) {
            barWidth = 3;
        }
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
        sliderContainerWidth,
        sliderContainerRightPosition,
        sliderContainerLeftPosition
    ) => {
        this.setState({
            sliderContainerWidth,
            sliderContainerRightPosition,
            sliderContainerLeftPosition,
            barMinLocation: 0,
            barMaxLocation: sliderContainerWidth - this.buttonWidth
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

    handleLeftInput = e => {
        this.setState({ leftInputValue: e.target.value }, () =>
            this.getBoundries()
        );
        this.findLeftBarFromInput(e.target.value);
    };

    findLeftBarFromInput = input => {
        const { normalizedData, barLocations } = this.state;
        let index = normalizedData.findIndex(el => {
            return el.value >= input;
        });
        if (index !== -1) {
            this.setState({ barMinLocation: barLocations[index] });
        }
    };

    handleRightInput = e => {
        this.setState({ rightInputValue: e.target.value }, () =>
            this.getBoundries()
        );
        this.findRightBarFromInput(e.target.value);
    };

    findRightBarFromInput = input => {
        const { normalizedData, barLocations } = this.state;
        let index = 0;
        for (let i = normalizedData.length - 1; i > 0; i--) {
            if (normalizedData[i].value <= input) {
                index = i;
                break;
            }
        }
        if (index !== 0) {
            this.setState({ barMaxLocation: barLocations[index] });
        }
    };

    /////////////////////////////////////////////
    // sets position_min and position_max from mouse movement
    //////////////////////////////////////////////
    findInputValueFromButtonLocation = (mouse_location, bar_id) => {
        const { barLocations, normalizedData } = this.state;
        let index = 0;

        if (bar_id === "Min") {
            index = Object.values(barLocations).findIndex(el => {
                return mouse_location - this.buttonWidth <= el;
            });

            if (index === -1) {
                index = 0;
            }
        } else {
            for (let i = Object.keys(barLocations).length; i > 0; i--) {
                if (mouse_location - this.buttonWidth >= barLocations[i]) {
                    index = i;
                    break;
                }
            }
        }
        if (normalizedData[index]) {
            return normalizedData[index].value;
        } else {
            return normalizedData[normalizedData.length - 1].value;
        }
    };

    handleButtonMovement = ({ clientX }, btn_id) => {
        const {
            normalizedData,
            sliderContainerLeftPosition,
            sliderContainerRightPosition,
            sliderContainerWidth
        } = this.state;

        if (normalizedData.length > 0) {
            if (
                sliderContainerLeftPosition + this.buttonWidth / 2 < clientX &&
                clientX < sliderContainerRightPosition - this.buttonWidth / 2
            ) {
                if (btn_id === "Min") {
                    this.setState(
                        {
                            barMinLocation:
                                clientX -
                                sliderContainerLeftPosition -
                                this.buttonWidth / 2,
                            leftInputValue: this.findInputValueFromButtonLocation(
                                clientX - sliderContainerLeftPosition,
                                btn_id
                            )
                        },
                        () => this.getBoundries()
                    );
                } else {
                    this.setState(
                        {
                            barMaxLocation:
                                clientX -
                                sliderContainerLeftPosition -
                                this.buttonWidth / 2,
                            rightInputValue: this.findInputValueFromButtonLocation(
                                clientX - sliderContainerLeftPosition,
                                btn_id
                            )
                        },
                        () => this.getBoundries()
                    );
                }
            } else if (
                clientX <
                sliderContainerLeftPosition + this.buttonWidth / 2
            ) {
                this.setState({ [`bar${btn_id}Location`]: 0 });
            } else if (
                sliderContainerRightPosition - this.buttonWidth <
                clientX
            ) {
                this.setState({
                    [`bar${btn_id}Location`]:
                        sliderContainerWidth - this.buttonWidth
                });
            }
        }
    };

    barContainerVerticalAdjust = () => {
        const { normalizedData, dataSetMinValue, dataSetMaxValue } = this.state;

        if (this.state.normalizedData.length > 0) {
            let adjustment = 0;

            if (dataSetMinValue < 0 && dataSetMaxValue > 0) {
                adjustment = Math.abs(normalizedData[0].normalizedValue);
            }

            if (dataSetMaxValue < 0) {
                adjustment = Math.abs(normalizedData[0].normalizedValue);
            }

            let diff = this.histogram.current.offsetHeight - 2 - adjustment;
            return `${diff}px`;
        }
    };

    render() {
        const {
            dataSetMaxValue,
            dataSetMinValue,
            normalizedData,
            barMinLocation,
            barMaxLocation,
            barLocations,
            barWidth,
            sliderContainerWidth,
            sliderContainerRightPosition,
            sliderContainerLeftPosition,
            inputFocus,
            leftInputValue,
            rightInputValue,
            input_with_focus
        } = this.state;

        let scaleStep =
            Math.abs(Number(dataSetMaxValue) - Number(dataSetMinValue)) / 4;
        let scaleSteps = [Number(dataSetMinValue)];
        for (let i = 1; i <= this.props.scaleIncrements; i++) {
            scaleSteps.push((Number(scaleSteps[i - 1]) + scaleStep).toFixed(2));
        }
        return (
            <div className="histogramComponent">
                <div className="mainSection">
                    <div className="scaleContainer">
                        {scaleStep < 100000 &&
                            scaleSteps.map((step, i) => {
                                return (
                                    <div key={i} className="scale-step">
                                        {step}%
                                    </div>
                                );
                            })}
                    </div>
                    <div
                        ref={this.histogram}
                        className={`histogram ${
                            this.props.showSlider ? "showSlider" : ""
                        }`}
                    >
                        <div
                            className="bar-container"
                            style={{
                                marginTop: this.barContainerVerticalAdjust()
                            }}
                        >
                            {normalizedData.map((bar, index) => {
                                let barMarginTop,
                                    barMarginBottom,
                                    color,
                                    barHeight,
                                    directionalClass;
                                if (bar.normalizedValue > 0) {
                                    barMarginTop = 0;
                                    barMarginBottom = Math.abs(
                                        bar.normalizedValue
                                    );
                                    directionalClass = "positiveBar";
                                } else {
                                    barMarginTop = Math.abs(
                                        bar.normalizedValue
                                    );
                                    barMarginBottom = 0;
                                    directionalClass = "negativeBar";
                                }

                                if (Math.abs(bar.normalizedValue) < 1) {
                                    barHeight = 1;
                                } else {
                                    barHeight = Math.abs(bar.normalizedValue);
                                }

                                if (
                                    !this.props.showSlider ||
                                    (barMinLocation <=
                                        barLocations[index] +
                                            this.buttonWidth -
                                            this.buttonWidth / 2 &&
                                        barLocations[index] +
                                            this.buttonWidth -
                                            this.buttonWidth / 2 <=
                                            barMaxLocation - barWidth)
                                ) {
                                    if (bar.normalizedValue > 0) {
                                        color = "green";
                                    } else {
                                        color = "red";
                                    }
                                } else {
                                    color = "lightgrey";
                                }

                                return (
                                    <Bar
                                        key={index}
                                        index={index}
                                        height={barHeight}
                                        marginBottom={barMarginBottom}
                                        marginTop={barMarginTop}
                                        backgroundColor={color}
                                        width={this.state.barWidth}
                                        tooltip={bar.tooltip}
                                        setBarLocation={this.setBarLocation}
                                        directionalClass={directionalClass}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                {this.props.showSlider && (
                    <Slider
                        getSliderBarDimensions={this.getSliderBarDimensions}
                        sliderContainerWidth={sliderContainerWidth}
                        sliderContainerLeftPosition={
                            sliderContainerLeftPosition
                        }
                        sliderContainerRightPosition={
                            sliderContainerRightPosition
                        }
                        handleButtonMovement={this.handleButtonMovement}
                        buttonLeft={barMinLocation}
                        buttonRight={barMaxLocation}
                    />
                )}
                {this.props.showInputs && (
                    <div className="input-section">
                        <div
                            className={`input-container ${
                                input_with_focus === "left_boundry"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                name="left_boundry"
                                min="-999"
                                max="999"
                                onChange={e => this.handleLeftInput(e)}
                                onFocus={this.handleInputFocus}
                                onBlur={this.handleInputFocus}
                                value={
                                    !inputFocus && !isNaN(leftInputValue)
                                        ? Number(leftInputValue).toFixed(2)
                                        : undefined
                                }
                                type="number"
                            />
                            %
                        </div>
                        to
                        <div
                            className={`input-container ${
                                input_with_focus === "right_boundry"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                name="right_boundry"
                                min="-999"
                                max="999"
                                onChange={e => this.handleRightInput(e)}
                                onFocus={this.handleInputFocus}
                                onBlur={this.handleInputFocus}
                                value={
                                    !inputFocus && !isNaN(rightInputValue)
                                        ? Number(rightInputValue).toFixed(2)
                                        : undefined
                                }
                                type="number"
                            />
                            %
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Histogram.defaultProps = defaultProps;

Histogram.propTypes = {
    data: PropTypes.array,
    barWidthPercentage: PropTypes.number
};

export default Histogram;
