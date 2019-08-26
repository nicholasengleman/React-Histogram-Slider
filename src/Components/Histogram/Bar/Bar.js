import React from "react";
import styles from "./Bar.module.scss"

const Bar = React.forwardRef((props, ref) => {
    return (
        <div style={{
            height: props.height,
            marginBottom: props.marginBottom,
            marginTop: props.marginTop,
            backgroundColor: props.backgroundColor,
            width: props.width
        }}
             className={styles.bar}
             ref={ref}
        >
            <div className={styles.tooltip}>

                {
                    props.tooltip.map(el => {
                        return <p>{el}</p>
                    })
                }

                <div className={styles.tooltipArrow}></div>
            </div>
        </div>
    )
});

export default Bar;