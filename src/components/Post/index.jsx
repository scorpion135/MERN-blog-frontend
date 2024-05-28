import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import { fetchRemovePost } from "../../redux/slices/posts";
import {
  fetchPostComments,
  fetchRemoveComments,
  fetchComments,
} from "../../redux/slices/comments";
import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  commentsCount,
  setTagsChanged,
}) => {
  const dispatch = useDispatch();
  // const { items } = useSelector((state) => state.comments.postComments);

  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(fetchPostComments(id));
  }, []);

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = async () => {
    try {
      if (window.confirm("Вы уверены, что хотите удалить статью?")) {
        dispatch(fetchRemovePost(id));
        dispatch(fetchRemoveComments(id));
        dispatch(fetchComments());
        setTagsChanged(true);
      }
    } catch (err) {
      console.warn(err);
      alert("Ошибка удаления!");
    }
  };

  const showComment = () => {
    navigate(`/posts/${id}`);
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags[0] !== ""
              ? tags.map((name) => (
                  <li key={name}>
                    <Link to={`/tags/${name}`}>#{name}</Link>
                  </li>
                ))
              : ""}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li className={styles.commentsCount} onClick={showComment}>
              <CommentIcon />

              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
