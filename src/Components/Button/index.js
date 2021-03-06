import React from 'react';
import './Button.css';

const Button = (props) => {
    return (
        <button type="button"
                {...props}
                onKeyDown={(e) => e.preventDefault()}
        >
            {props.buttonValue}
        </button>
    );
};

export default Button;
