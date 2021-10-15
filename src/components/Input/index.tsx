import React from "react";
import { InputProps } from "./types";

const Input: React.FC<InputProps> = ({ name, ...rest }) => {
    return (
        <div>
            <input id={name} type="text" {...rest}></input>
        </div>
    );
};

export default Input;
