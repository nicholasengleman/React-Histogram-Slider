import React, { Component } from "react";
import SliderBtn from "./SliderBtn/SliderBtn";
import "./Slider.css";

class Slider extends Component {
  constructor(props) {
    super(props);

    this.sliderBar = React.createRef();

    this.state = {
      sliderBarWidth: 0,
      btn_1: 0,
      btn_2: 0
    };
  }

  componentDidMount() {
    this.setState({
      sliderBarWidth: this.sliderBar.current.offsetWidth,
      btn_2: this.sliderBar.current.offsetWidth
    });
  }

  setBtnLocation = (btn_id, location) => {
    this.setState({ [btn_id]: location });
  };

  render() {
    return (
      <div className="sliderContainer">
        <div className="sliderBar" ref={this.sliderBar}>
          <div
            style={{ right: "calc("+this.state.sliderBarWidth+"px - " + this.state.btn_1 + "px)", left: 0 }}
            className="sliderBarOverlay"
          />
            <div
            style={{ left: this.state.btn_2 +"px", right: 0 }}
            className="sliderBarOverlay"
          />
        </div>

        <SliderBtn
          btn_id={"btn_1"}
          other_btn_location={this.state.btn_2}
          sortedData={this.props.sortedData}
          sliderBarWidth={this.state.sliderBarWidth}
          getBoundry={this.props.getLeftBoundry}
          setBtnLocation={this.setBtnLocation}
          startingPosition={0}
        />
        <SliderBtn
          btn_id={"btn_2"}
          other_btn_location={this.state.btn_1}
          sortedData={this.props.sortedData}
          sliderBarWidth={this.state.sliderBarWidth}
          getBoundry={this.props.getRightBoundry}
          setBtnLocation={this.setBtnLocation}
          startingPosition={this.state.sliderBarWidth}
        />
      </div>
    );
  }
}

export default Slider;
