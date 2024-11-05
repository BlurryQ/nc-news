import axios from "axios";

const articlesAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/comments",
});

export default function deleteComment(commentID) {
  return articlesAPI.delete(`/${commentID}`).then((response) => {
    return response.status;
  });
}
