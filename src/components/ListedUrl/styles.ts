import styled, { keyframes } from "styled-components";

const opacityChange = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;
export const FoundUrl = styled.span`
    color: var(--black);
    word-break: break-all;
    padding: 5px;

    :nth-child(even) {
        background-color: var(--yellow-light);
    }

    & + .found-url {
        padding-top: 5px;
    }

    animation: ${opacityChange} 0.4s linear forwards;
`;
