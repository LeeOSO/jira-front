import React, { FormEvent } from "react";
import { useAuh } from "../../context/auth-context";

const apiURL = process.env.REACT_APP_API_URL;
export const LoginScreen = () => {
  // const login = (user: { username: string; password: string }) => {
  //   fetch(`${apiURL}/register?`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(user),
  //   }).then(async (response) => {
  //     if (response.ok) {
  //     }
  //   });
  // };
  const { login, user } = useAuh();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.currentTarget.elements[0] as HTMLInputElement)
      .value;
    const password = (event.currentTarget.elements[1] as HTMLInputElement)
      .value;
    //鸭子类型"面向接口编程而不是面向对象类型。只要类型匹配就可以
    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {user ? <div>登录成功，用户名：{user?.name}</div> : null}
        <label htmlFor={"username"}>用户名</label>
        <input type={"text"} id={"username"} />
      </div>
      <div>
        <label htmlFor={"password"}>用户名</label>
        <input type={"password"} id={"password"} />
      </div>
      <button type={"submit"}>登录</button>
    </form>
  );
};
