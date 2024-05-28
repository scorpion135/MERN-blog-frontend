import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

import { fetchPostComments } from "./../redux/slices/comments";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useEffect } from "react";

import axios from "../axios.js";

import { defineMonth } from "../utils/date.js";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdded, setIsAdded] = React.useState(false);
  const { id } = useParams();

  const { items, status } = useSelector((state) => state.comments.postComments);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPostComments(id));
    setIsAdded(false);
  }, [isAdded]);

  React.useEffect(() => {
    dispatch(fetchPostComments(id));
  }, []);

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444/${data.imageUrl}` : ""}
        //imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
        user={data.user}
        createdAt={`${new Date(
          Date.parse(data.createdAt)
        ).getDate()} ${defineMonth(
          new Date(Date.parse(data.createdAt)).getMonth()
        )} ${new Date(Date.parse(data.createdAt)).getFullYear()} г.`}
        viewsCount={data.viewCount}
        commentsCount={items.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        id={id}
        items={items}
        isLoading={status === "loading" ? true : false}
      >
        <Index id={id} componentAdded={setIsAdded} />
      </CommentsBlock>
    </>
  );
};
