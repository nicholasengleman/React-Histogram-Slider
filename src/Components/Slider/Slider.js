import React, { Component } from "react";

import SliderBtn from "./SliderBtn/SliderBtn";
import "./Slider.css";

class Slider extends Component {
    constructor(props) {
        super(props);
        this.sliderBar = React.createRef();
        this.sliderWidthCalculated = false;
        this.sliderWidth = 0;
    }

    componentDidMount() {
        let that = this;
        window.addEventListener("resize", function() {
            that.calculateDimensions();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.sliderWidthCalculated === false) {
            this.calculateDimensions();
        }
    }

    calculateDimensions() {
        const rect = this.sliderBar.current.getBoundingClientRect();
        let sliderWidth = rect.right - rect.left;
        if (sliderWidth !== this.sliderWidth) {
            this.props.getSliderBarDimensions(sliderWidth, rect.right, rect.left);
            this.sliderWidthCalculated = true;
            this.sliderWidth = sliderWidth;
        }
    }

    render() {
        return (
            <div className="sliderContainer">
                <div className="sliderBar" ref={this.sliderBar}>
                    <div
                        style={{
                            right: "calc(" + this.props.sliderContainerWidth + "px - " + this.props.buttonLeft + "px)",
                            left: 0
                        }}
                        className="sliderBarOverlay"
                    />
                    <div
                        style={{
                            left:
                                this.props.buttonRight !== 0
                                    ? this.props.buttonRight
                                    : this.props.sliderContainerWidth + "px",
                            right: 0
                        }}
                        className="sliderBarOverlay"
                    />
                </div>

                <SliderBtn
                    btn_id={"Min"}
                    handleButtonMovement={this.props.handleButtonMovement}
                    translateX={this.props.buttonLeft}
                />

                <SliderBtn
                    btn_id={"Max"}
                    handleButtonMovement={this.props.handleButtonMovement}
                    translateX={this.props.buttonRight !== 0 ? this.props.buttonRight : this.props.sliderContainerWidth - this.buttonWidth}
                />
            </div>
        );
    }
}

export default Slider;
