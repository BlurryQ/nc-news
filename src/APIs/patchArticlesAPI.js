import axios from "axios";

const articlesAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/articles",
});

export default function patchArticles(articleID, body) {
  return articlesAPI.patch(`/${articleID}`, body).then((response) => {
    return response.data;
  });
}
