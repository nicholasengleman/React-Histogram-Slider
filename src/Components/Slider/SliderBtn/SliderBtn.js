import React, { Component } from "react";
import "./SliderBtn.css";

class Sliderbtn extends Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();

    this.state = {
      position_x: 0,
      bar: 0
    };
  }

  componentDidUpdate = () => {
    if (this.state.position_x === 0 && this.props.startingPosition !== 0) {
      this.setState({ position_x: this.props.startingPosition });
      this.findCurrentBar(this.props.startingPosition);
    }
  };

  onDrag = event => {
    let position_x = event.clientX - 50;

    if (
      position_x !== 0 &&
      position_x > 0 &&
      position_x < this.props.sliderBarWidth - 25
    ) {
      if (
        (this.props.startingPosition === 0 &&
          position_x < this.props.other_btn_location) ||
        (this.props.startingPosition !== 0 &&
          position_x > this.props.other_btn_location)
      ) {
        this.props.setBtnLocation(this.props.btn_id, position_x);
        this.setState({ position_x: position_x });
        this.findCurrentBar(position_x);
      }
    }
  };

  findCurrentBar = position_x => {
    let percentageTravelled = position_x / this.props.sliderBarWidth;
    let bar =
      Math.floor(this.props.sortedData.length * percentageTravelled) + 1;

    if (bar < 0) {
      bar = 0;
    } else if (bar > this.props.sortedData.length) {
      bar = this.props.sortedData.length - 1;
    }
    if (this.state.bar > 0) {
      this.props.getBoundry(this.state.bar);
    }
    this.setState({ bar });
  };

  render() {
    return (
      <div
        className="sliderBtn-container"
        style={{
          transform: "translateX(" + this.state.position_x + "px)"
        }}
        draggable={true}
        onDrag={event => this.onDrag(event)}
      >
        <button className="slider-btn" />
        <div className="label" />
        {this.props.sortedData[this.state.bar] &&
          this.props.sortedData[this.state.bar].value}
      </div>
    );
  }
}

export default Sliderbtn;
