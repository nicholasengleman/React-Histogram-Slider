import React, { Component } from "react";
import PropTypes from "prop-types";
import "./SliderBtn.css";

class Sliderbtn extends Component {
    componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleMouseUp);
        window.removeEventListener("touchend", this.handleMouseUp);
    }

    handleMouseDown = ({ clientX }) => {
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("touchmove", this.handleMouseMove);

        window.addEventListener("mouseup", this.handleMouseUp);
        window.addEventListener("touchend", this.handleMouseUp);
    };

    handleMouseMove = e => {
        let clientX;
        if (e.clientX) {
            clientX = e.clientX;
        } else {
            clientX = e.touches[0].clientX;
        }

        this.props.handleButtonMovement({ clientX }, this.props.btn_id);

        // reports locations to prevent collision with other buttons
        // this.props.setLocation(this.props.btn_id, this.state.translateX);
    };

    handleMouseUp = () => {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("touchmove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
        window.removeEventListener("touchend", this.handleMouseUp);
    };

    render() {
        return (
            <button
                className="slider-btn"
                style={{
                    transform: "translateX(" + this.props.translateX + "px)"
                }}
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleMouseDown}
            />
        );
    }
}

Sliderbtn.propTypes = {
    btn_id: PropTypes.string,
    handleButtonMovement: PropTypes.func,
    translateX: PropTypes.number
};

export default Sliderbtn;
