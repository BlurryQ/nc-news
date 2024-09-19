import axios from "axios";

const articlesAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/articles",
});

export default function getArticles(searchTerm) {
  return articlesAPI.get(`/${searchTerm}`).then((response) => {
    return response.data;
  });
}
