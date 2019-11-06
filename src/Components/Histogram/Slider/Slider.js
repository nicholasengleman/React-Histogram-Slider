import React, { Component } from "react";
import PropTypes from "prop-types";
import SliderBtn from "./SliderBtn/SliderBtn";
import _ from "lodash";
import "./Slider.css";

class Slider extends Component {
    constructor(props) {
        super(props);
        this.sliderBar = React.createRef();
        this.sliderWidth = 0;
        this.calculateDimensions = _.throttle(this.calculateDimensions.bind(this), 200);
    }

    componentDidMount() {
        this.calculateDimensions();
        window.addEventListener("resize", () => {
            this.calculateDimensions();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.calculateDimensions();
    }

    calculateDimensions() {
        if (this.sliderBar.current) {
            const rect = this.sliderBar.current.getBoundingClientRect();
            let sliderWidth = rect.right - rect.left;
            if (sliderWidth !== this.sliderWidth) {
                this.props.getSliderBarDimensions(sliderWidth, rect.right, rect.left);
                this.sliderWidthCalculated = true;
                this.sliderWidth = sliderWidth;
            }
        }
    }

    render() {
        const { sliderContainerWidth, buttonLeft, buttonRight, handleButtonMovement } = this.props;
        return (
            <div className="sliderContainer">
                <div className="sliderBar" ref={this.sliderBar}>
                    <div
                        style={{
                            right: "calc(" + sliderContainerWidth + "px - 25px - " + buttonLeft + "px)",
                            left: 0
                        }}
                        className="sliderBarOverlay"
                    />
                    <div
                        style={{
                            left: buttonRight !== 0 ? buttonRight : sliderContainerWidth + "px",
                            right: 0
                        }}
                        className="sliderBarOverlay"
                    />
                </div>

                <SliderBtn btn_id={"Min"} handleButtonMovement={handleButtonMovement} translateX={buttonLeft} />

                <SliderBtn
                    btn_id={"Max"}
                    handleButtonMovement={handleButtonMovement}
                    translateX={buttonRight !== 0 ? buttonRight : sliderContainerWidth - this.buttonWidth}
                />
            </div>
        );
    }
}

Slider.propTypes = {
    sliderContainerWidth: PropTypes.number,
    buttonLeft: PropTypes.number,
    buttonRight: PropTypes.number,
    handleButtonMovement: PropTypes.func,
    getSliderBarDimensions: PropTypes.func,
    sliderContainerRightPosition: PropTypes.number,
    sliderContainerLeftPosition: PropTypes.number
};

export default Slider;
