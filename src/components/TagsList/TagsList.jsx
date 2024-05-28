import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsFromTag } from "./../../redux/slices/posts";
import { fetchPostComments } from "./../../redux/slices/comments";

import { Post } from "../Post/index";
import { defineMonth } from "../../utils/date";

import Grid from "@mui/material/Grid";

export const TagsList = () => {
  const { tag } = useParams();
  console.log(tag);
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { items, status } = useSelector(
    (state) => state.comments.allPostsComments
  );
  console.log(posts.items);

  const isPostLoading = posts.status === "loading";
  const userData = useSelector((state) => state.auth.data);

  React.useEffect(() => {
    try {
      dispatch(fetchPostsFromTag(tag));
    } catch (err) {
      console.warn(err);
      alert("Какая-то ошибка");
    }
  }, []);
  return (
    <>
      <h1>{`#${tag}`}</h1>
      <Grid container spacing={5}>
        {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          isPostLoading ? (
            <Grid item xs={6}>
              <Post key={index} isLoading={true} />
            </Grid>
          ) : (
            <Grid item xs={6}>
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444/${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={`${new Date(
                  Date.parse(obj.createdAt)
                ).getDate()} ${defineMonth(
                  new Date(Date.parse(obj.createdAt)).getMonth()
                )} ${new Date(Date.parse(obj.createdAt)).getFullYear()} г.`}
                viewsCount={obj.viewCount}
                commentsCount={
                  items.filter((item) => item.post === obj._id).length
                }
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            </Grid>
          )
        )}
      </Grid>
    </>
  );
};
