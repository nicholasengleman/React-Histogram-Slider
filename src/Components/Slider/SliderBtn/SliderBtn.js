import React, { Component } from "react";
import "./SliderBtn.css";

class Sliderbtn extends Component {
    componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseDown = ({ clientX }) => {
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
    };

    handleMouseMove = ({ clientX }) => {
        this.props.handleButtonMovement({ clientX }, this.props.btn_id);

        // reports locations to prevent collision with other buttons
        // this.props.setLocation(this.props.btn_id, this.state.translateX);
    };

    handleMouseUp = () => {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    };

    render() {
        return (
            <button
                className="slider-btn"
                style={{
                    transform: "translateX(" + this.props.translateX + "px)"
                }}
                onMouseDown={this.handleMouseDown}
            />
        );
    }
}

export default Sliderbtn;
