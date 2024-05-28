import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios.js";

export const Index = ({ id, componentAdded }) => {
  const [text, setText] = React.useState("");
  const [data, setData] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const inputRef = React.useRef("");

  React.useEffect(() => {
    axios
      .get(`/auth/me`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        text,
        id,
      };

      await axios.post("/comments", fields);
      componentAdded(true);
      setText("");
      inputRef.current.focus();
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создании статьи");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={`http://localhost:4444/${data.avatarUrl}`}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
