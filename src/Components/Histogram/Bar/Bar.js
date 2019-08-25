import React from "react";

const Bar = React.forwardRef((props, ref) => {
    return (
        <div style={{
            height: props.height,
            marginBottom: props.marginBottom,
            marginTop: props.marginTop,
            backgroundColor: props.backgroundColor,
            width: props.width
        }}
             ref={ref}
        />
    )
});

export default Bar;