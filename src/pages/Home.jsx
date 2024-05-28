import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

import {
  fetchPosts,
  fetchPopularPosts,
  fetchTags,
} from "../redux/slices/posts";
import { fetchComments, fetchAllComments } from "../redux/slices/comments";
import { defineMonth } from "../utils/date";

export const Home = () => {
  const dispatch = useDispatch();

  const [index, setIndex] = React.useState(0);
  const [tagsChanged, setTagsChanged] = React.useState(false);

  const { posts, tags } = useSelector((state) => state.posts);
  const allComments = useSelector(
    (state) => state.comments.allPostsComments.items
  );
  const { items, status } = useSelector((state) => state.comments.allComments);

  const userData = useSelector((state) => state.auth.data);

  const isPostLoading = posts.status === "loading";
  const areTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
    dispatch(fetchAllComments());
  }, []);

  useEffect(() => {
    dispatch(fetchTags());
    setTagsChanged(false);
  }, [tagsChanged]);

  const onPopularPosts = () => {
    try {
      setIndex(1);
      dispatch(fetchPopularPosts());
    } catch (err) {
      console.warn("Не удалось получить статьи");
      alert("Ошибка в получении статей");
    }
  };

  const onAllPosts = () => {
    try {
      if (index) {
        setIndex(0);
        dispatch(fetchPosts());
      }
    } catch (err) {
      console.warn("Не удалось получить статьи");
      alert("Какая-то хрень");
    }
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={index}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={onAllPosts} />
        <Tab label="Популярные" onClick={onPopularPosts} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
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
                tags={obj.tags}
                commentsCount={
                  allComments.filter((item) => item.post === obj._id).length
                }
                isEditable={userData?._id === obj.user._id}
                setTagsChanged={setTagsChanged}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={areTagsLoading} />
          <CommentsBlock
            items={items}
            isLoading={status === "loading" ? true : false}
          />
        </Grid>
      </Grid>
    </>
  );
};
