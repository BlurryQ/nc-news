import axios from "axios";

const articlesAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/articles",
});

export default function postArticles(searchTerm, body) {
  return articlesAPI.post(`/${searchTerm}`, body).then((response) => {
    return response.data;
  });
}
