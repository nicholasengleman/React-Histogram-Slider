import React from "react";
import "./Bar.scss";

const Bar = React.forwardRef((props, ref) => {
    return (
        <div
            style={{
                height: props.height,
                marginBottom: props.marginBottom,
                marginTop: props.marginTop,
                backgroundColor: props.backgroundColor,
                width: props.width
            }}
            className={`Bar ${[props.directionalClass]}`}
            ref={ref}
        >
            <div className="tooltip">
                {props.tooltip &&
                    props.tooltip.map(el => {
                        return <p>{el}</p>;
                    })}

                <div className="tooltipArrow"></div>
            </div>
        </div>
    );
});

export default Bar;
