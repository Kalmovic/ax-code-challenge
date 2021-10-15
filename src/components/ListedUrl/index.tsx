import React, { memo } from "react";
import { FoundUrl } from "./styles";

// import { Container } from './styles';

interface ListedUrlProps {
    url: string;
}

function ListedUrlComponent({ url }: ListedUrlProps) {
    return <FoundUrl className="found-url">{url}</FoundUrl>;
}

export const ListedUrl = memo(ListedUrlComponent, (prevProps, nextProps) => {
    return prevProps.url === nextProps.url;
});
