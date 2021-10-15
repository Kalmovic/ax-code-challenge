import styled, { css, keyframes } from "styled-components";

const opacityChange = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 200px auto 50px;
    max-width: 400px;
`;

interface InputWrapperProps {
    error: boolean;
}

export const InputWrapper = styled.section<InputWrapperProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--white);
    border: ${(props) =>
        props.error ? "1px solid var(--warning)" : "1px solid var(--purple)"};
    border-radius: 26px;
    padding: 12px 12px 12px 24px;
    width: 100%;
`;

export const ErrorMessage = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: var(--warning);

    margin-top: 10px;
`;

export const SearchLabel = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: var(--white);
`;

export const Results = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    background: var(--white);
    border-radius: 10px;
    padding: 10px;
    width: 100%;
`;

export const ResultItem = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: var(--background);
    border-radius: 5px 0px 0px 5px;

    & + .result-item {
        margin-top: 10px;
    }

    animation: ${opacityChange} 0.2s linear forwards;
`;

export const SeachKeyStatus = styled.div`
    display: flex;
`;

export const ExpandSpan = styled.span`
    color: var(--purple);
    text-align: center;
    text-decoration: underline;

    margin-right: 8px;

    :hover {
        cursor: pointer;
    }
`;

export const Keyword = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px;
    color: var(--black);

    margin-left: 8px;
`;
export const UrlList = styled.ul`
    margin: 10px 0;
    display: flex;
    flex-direction: column;
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

export const NotFound = styled.span`
    color: var(--black);
    text-align: center;
    margin-top: 10px;
`;

export const DetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;

    margin-bottom: 12px;

    animation: ${opacityChange} 0.4s linear forwards;
`;

export const ButtonWrapper = styled.div`
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface TagProps {
    status: string;
}

export const Tag = styled.div<TagProps>`
    width: 70px;
    padding: 2px 4px;
    background: ${(props) =>
        props.status === "active" ? "var(--orange)" : "var(--green)"};
    border-radius: 5px 0 0px 5px;
    text-align: center;
`;
