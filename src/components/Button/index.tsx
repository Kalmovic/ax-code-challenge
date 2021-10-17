import React from "react";
import { ButtonTag } from "./styles";
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
    return (
        <ButtonTag disabled={disabled} onClick={onClick}>
            {children}
        </ButtonTag>
    );
};

export default Button;
