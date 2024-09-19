import axios from "axios";

const articlesAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/articles",
});

export default function patchArticles(searchTerm, body) {
  return articlesAPI.patch(`/${searchTerm}`, body).then((response) => {
    return response.data;
  });
}
