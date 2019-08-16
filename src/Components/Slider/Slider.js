import React, { Component } from "react";

import SliderBtn from "./SliderBtn/SliderBtn";
import "./Slider.css";

class Slider extends Component {
  constructor(props) {
    super(props);

    this.sliderBar = React.createRef();

    this.state = {
      sliderBarWidth: 0,
      sliderBarLeft: 0,
      sliderBarRight: 0,
      btn_1: 0,
      btn_2: 0
    };
  }

  componentDidMount() {
    const rect = this.sliderBar.current.getBoundingClientRect();
    let sliderWidth = rect.right - rect.left;

    this.setState({
      sliderBarWidth: sliderWidth,
      sliderBarLeft: rect.left,
      sliderBarRight: rect.right
    });
    this.props.getSliderBarDimensions(
      sliderWidth,
      rect.right,
      rect.left + 12.5
    );
  }

  setLocation = (btn_id, location) => {
    this.setState({ [btn_id]: location });
  };

  render() {
    return (
      <div className="sliderContainer">
        <div className="sliderBar" ref={this.sliderBar}>
          <div
            style={{
              right:
                "calc(" +
                this.state.sliderBarWidth +
                "px - " +
                this.state.btn_1 +
                "px)",
              left: 0
            }}
            className="sliderBarOverlay"
          />
          <div
            style={{ left: this.state.btn_2 + "px", right: 0 }}
            className="sliderBarOverlay"
          />
        </div>

        <SliderBtn
          btn_id={"button_left"}
          other_btn_location={this.state.btn_1}
          setLocation={this.setLocation}
          handleCalculateTranslateX={this.props.handleCalculateTranslateX}
          translateX={this.props.translateXLeft}
        />

        <SliderBtn
          btn_id={"button_right"}
          other_btn_location={this.state.btn_2}
          setLocation={this.setLocation}
          handleCalculateTranslateX={this.props.handleCalculateTranslateX}
          translateX={
            this.props.translateXRight !== 0
              ? this.props.translateXRight
              : this.state.sliderBarWidth
          }
        />
      </div>
    );
  }
}

export default Slider;
