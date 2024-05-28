import React from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";

import { fetchAuthRegister } from "../../redux/slices/auth";
import { selectIsAuth } from "../../redux/slices/auth";

import axios from "../../axios.js";

export const Registration = () => {
  const dispatch = useDispatch();
  const inputFileRef = React.useRef(null);

  const [avatarUrl, setAvatarUrl] = React.useState();

  // const data = useSelector((state) => state.auth.data);

  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleChoosePhoto = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      console.log(file);
      formData.append("image", file);
      const { data } = await axios.post("/upload/avatar", formData);
      setAvatarUrl(data.url);
    } catch (err) {
      console.log("Ошибка при загрузке файла");
    }
  };

  const onSubmit = async (values) => {
    const fields = {
      ...values,
      avatarUrl,
    };

    const data = await dispatch(fetchAuthRegister(fields));

    if (!data.payload) {
      return alert("Не удалось зарегистрироваться");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div
        className={styles.avatar}
        onClick={() => inputFileRef.current.click()}
      >
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={`http://localhost:4444/${avatarUrl}`}
        />
      </div>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChoosePhoto}
        hidden
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", {
            required: "Укажите имя",
            minLength: {
              value: 2,
              message: "Имя должно включать минимум 2 символа",
            },
          })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Укажите почту" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", {
            required: "Укажите пароль",
            minLength: {
              value: 4,
              message: "Пароль должен содержать минимум 4 символа",
            },
          })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
