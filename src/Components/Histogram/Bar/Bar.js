import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import "./Bar.scss";

class Bar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.offset = 0;
        this.setBarLocation = _.throttle(this.props.setBarLocation.bind(this), 200);
    }

    componentDidMount() {
        this.setBarLocation(this.props.index, this.ref.current.offsetLeft);
        window.addEventListener("resize", () => {
            if (this.ref.current) {
                this.setBarLocation(this.props.index, this.ref.current.offsetLeft);
            }
        });
    }

    componentDidUpdate() {
        if (this.offset !== this.ref.current.offsetLeft) {
            if (this.ref.current) {
                this.offset = this.ref.current.offsetLeft;
                this.setBarLocation(this.props.index, this.ref.current.offsetLeft);
            }
        }
    }

    render() {
        const { tooltip, directionalClass, height, marginBottom, marginTop, backgroundColor, width } = this.props;

        return (
            <div
                style={{
                    height: height || 0,
                    marginBottom: marginBottom || 0,
                    marginTop: marginTop || 0,
                    backgroundColor: backgroundColor,
                    width
                }}
                className={`bar ${[directionalClass]}`}
                ref={this.ref}
            >
                <div className="tooltip">
                    <p>{tooltip && tooltip.name}</p>
                    <p>{tooltip && tooltip.value}%</p>
                    <div className="tooltipArrow"></div>
                </div>
            </div>
        );
    }
}

Bar.propTypes = {
    tooltip: PropTypes.object,
    directionalClass: PropTypes.string,
    height: PropTypes.number,
    marginBottom: PropTypes.number,
    marginTop: PropTypes.number,
    backgroundColor: PropTypes.string,
    width: PropTypes.number
};

export default Bar;
