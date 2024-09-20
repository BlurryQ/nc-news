import axios from "axios";

const commentsAPI = axios.create({
  baseURL: "https://nc-news-lbn1.onrender.com/api/comments",
});

export default function patchComment(commentID, body) {
  return commentsAPI.patch(`/${commentID}`, body).then((response) => {
    return response.data;
  });
}
