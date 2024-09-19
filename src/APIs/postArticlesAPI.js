import axios from "axios";

const articlesAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/articles",
});

export default function postArticles(articleID, body) {
  return articlesAPI.post(`/${articleID}`, body).then((response) => {
    return response.data;
  });
}
