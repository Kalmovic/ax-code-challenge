import React from "react";
import { getId, getKeywordResult } from "../../services/api";
import Button from "../Button";
import Input from "../Input";
import {
    ButtonWrapper,
    Content,
    DetailsWrapper,
    ErrorMessage,
    ExpandSpan,
    FoundUrl,
    InputWrapper,
    Keyword,
    NotFound,
    ResultItem,
    Results,
    SeachKeyStatus,
    SearchLabel,
    Tag,
    UrlList
} from "./styles";
import { IResult } from "./types";

const Dashboard: React.FC = () => {
    const [result, setResult] = React.useState<IResult[]>([]);
    const [search, setSearch] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    const checkAgain = async (identification: string) => {
        const responseStatus = await getKeywordResult(identification);

        const { id, status, urls }: any = responseStatus.data;

        let newResult = result.map((item) => {
            if (item.id === id) {
                item.status = status;
                item.urls = urls;
            }
            return item;
        });
        setResult(newResult);
    };

    const verifyInput = (search: string) => {
        if (search.length < 4) {
            setErrorMessage("Keyword must have more than 3 characters");
            return;
        } else if (search.length > 32) {
            setErrorMessage("Keyword must have less than 33 characters");
            return;
        } else {
            searchKeyWord(search);
            errorMessage !== "" && setErrorMessage("");
        }
    };

    const searchKeyWord = async (keyword: string) => {
        setSearch("");
        const responseId = await getId(keyword);
        const { id }: any = responseId.data;

        getResult(id);
    };

    const getResult = async (identification: string) => {
        const responseStatus = await getKeywordResult(identification);

        const { id, status, urls }: any = responseStatus.data;

        let newResult = [];
        newResult = [
            ...result,
            {
                id,
                status,
                urls,
                keyword: search,
                expanded: false
            }
        ];
        setResult(newResult);
    };

    const changeExpanded = (id: number) => {
        let newResult = result.map((item, index) => {
            if (index === id) item.expanded = !item.expanded;
            return item;
        });

        setResult(newResult);
    };

    return (
        <Content>
            <InputWrapper>
                <Input
                    name="Search"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search for keywords"
                />
                <Button onClick={() => verifyInput(search)}>
                    <SearchLabel>Search</SearchLabel>
                </Button>
            </InputWrapper>
            {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
            {result.length > 0 && (
                <Results className="results">
                    {result.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <ResultItem className="result-item" key={index}>
                                    <SeachKeyStatus>
                                        <Tag status={item.status}>
                                            {item.status.toUpperCase()}
                                        </Tag>
                                        <Keyword>{item.keyword}</Keyword>
                                    </SeachKeyStatus>
                                    <ExpandSpan
                                        onClick={() => changeExpanded(index)}
                                    >
                                        {item.expanded
                                            ? "hide urls"
                                            : "show urls"}
                                    </ExpandSpan>
                                </ResultItem>
                                {item.expanded ? (
                                    <DetailsWrapper>
                                        <UrlList>
                                            {item.urls.length > 0 ? (
                                                item.urls.map((url, index) => {
                                                    return (
                                                        <FoundUrl
                                                            className="found-url"
                                                            key={index}
                                                        >
                                                            {url}
                                                        </FoundUrl>
                                                    );
                                                })
                                            ) : (
                                                <NotFound>
                                                    Searching for URLs...
                                                </NotFound>
                                            )}
                                        </UrlList>
                                        {item.status === "active" ? (
                                            <ButtonWrapper>
                                                <Button
                                                    onClick={() =>
                                                        checkAgain(item.id)
                                                    }
                                                >
                                                    <SearchLabel>
                                                        Check Again
                                                    </SearchLabel>
                                                </Button>
                                            </ButtonWrapper>
                                        ) : null}
                                    </DetailsWrapper>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </Results>
            )}
        </Content>
    );
};

export default Dashboard;
