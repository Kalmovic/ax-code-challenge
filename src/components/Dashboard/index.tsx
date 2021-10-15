import React, { useEffect } from "react";
import { getId, getKeywordResult } from "../../services/api";
import Button from "../Button";
import Input from "../Input";
import { ListedUrl } from "../ListedUrl";
import {
    ButtonWrapper,
    Content,
    DetailsWrapper,
    ErrorMessage,
    ExpandSpan,
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
    const [inputError, setInputError] = React.useState(false);

    useEffect(() => {
        if (errorMessage.length > 0 && search.length === 0)
            setInputError(false);
    }, [search, errorMessage]);

    const checkAgain = async (identification: string) => {
        const responseStatus = await getKeywordResult(identification);

        if (responseStatus.status !== 200) {
            setError(
                "There was a problem with your request, please try again later"
            );
        }

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

    const setError = (error: string) => {
        setErrorMessage(error);
        setInputError(true);
    };

    const verifyInput = (search: string) => {
        const connected = navigator.onLine ? true : false;
        if (!connected) {
            setError("Please check your connection and try again");
            return;
        }
        const trimmedSearch = search.trim();
        if (/\s/g.test(trimmedSearch)) {
            setError("Keyword must be one word");
            return;
        }
        if (trimmedSearch.length < 4) {
            setError("Keyword must have more than 3 characters");
            return;
        } else if (trimmedSearch.length > 32) {
            setError("Keyword must have less than 33 characters");
            return;
        } else {
            searchKeyWord(trimmedSearch);
            inputError === true && setInputError(false);
            errorMessage !== "" && setErrorMessage("");
        }
        searchKeyWord(trimmedSearch);
    };

    const searchKeyWord = async (keyword: string) => {
        setSearch("");
        const responseId = await getId(keyword);
        console.log(responseId);

        if (responseId.status !== 200) {
            setError(
                "There was a problem with your request, please try again later"
            );
        }

        const { id }: any = responseId.data;

        getResult(id);
    };

    const getResult = async (identification: string) => {
        const responseStatus = await getKeywordResult(identification);

        if (responseStatus.status !== 200) {
            setError(
                "There was a problem with your request, please try again later"
            );
        }

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
            <InputWrapper data-testid="input-wrapper" error={inputError}>
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
                                                        <ListedUrl
                                                            key={index}
                                                            url={url}
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <NotFound>
                                                    {item.status === "active"
                                                        ? "Searching for URLs..."
                                                        : "No result found."}
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
                                                        Update
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
