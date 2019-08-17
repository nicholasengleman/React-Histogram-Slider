import React, { Component } from "react";

import SliderBtn from "./SliderBtn/SliderBtn";
import "./Slider.css";

class Slider extends Component {
    constructor(props) {
        super(props);
        this.sliderBar = React.createRef();
    }

    componentDidMount() {
        const rect = this.sliderBar.current.getBoundingClientRect();
        let sliderWidth = rect.right - rect.left;
        this.props.getSliderBarDimensions(sliderWidth, rect.right, rect.left);
    }

    render() {
        return (
            <div className="sliderContainer">
                <div className="sliderBar" ref={this.sliderBar}>
                    <div
                        style={{
                            right: "calc(" + this.props.sliderBarWidth + "px - " + this.props.translateXLeft + "px)",
                            left: 0
                        }}
                        className="sliderBarOverlay"
                    />
                    <div
                        style={{
                            left:
                                this.props.translateXRight !== 0
                                    ? this.props.translateXRight
                                    : this.props.sliderBarWidth + "px",
                            right: 0
                        }}
                        className="sliderBarOverlay"
                    />
                </div>

                <SliderBtn
                    btn_id={"button_left"}
                    handleCalculateTranslateX={this.props.handleCalculateTranslateX}
                    translateX={this.props.translateXLeft}
                />

                <SliderBtn
                    btn_id={"button_right"}
                    handleCalculateTranslateX={this.props.handleCalculateTranslateX}
                    translateX={
                        this.props.translateXRight !== 0 ? this.props.translateXRight : this.props.sliderBarWidth - 25
                    }
                />
            </div>
        );
    }
}

export default Slider;
