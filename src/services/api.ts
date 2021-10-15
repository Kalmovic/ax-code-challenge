import axios from "axios";

export const api = axios.create({
    baseURL: "http://testapp.axreng.com:3000/",
    headers: { "Content-Type": "application/json" }
});

export async function getKeywordResult(identification: string) {
    return await api.get(`/crawl/${identification}`);
}

export async function getId(keyword: string) {
    return await api.post("/crawl", {
        keyword
    });
}
