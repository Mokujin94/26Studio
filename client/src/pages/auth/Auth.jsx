import React from "react";

import { Link } from "react-router-dom";

import FunctionButton from "../../components/functionButton/FunctionButton";

function Auth() {
  return (
    <div className="auth">
      <h1 className="auth__title">Вход</h1>
      <form className="auth__form">
        <div className="auth__input">
          <h2 className="auth__input-title">Почта</h2>
          <input type="email" className="auth__input-item" />
        </div>
        <div className="auth__input">
          <h2 className="auth__input-title">Пароль</h2>
          <input type="password" className="auth__input-item" />
        </div>
        <Link to="/" className="auth__forget">
          Забыли пароль?
        </Link>
        <FunctionButton>Войти</FunctionButton>
        <div className="auth__notAuth">
          <p className="auth__notAuthText">Нет аккаунта?</p>
          <Link to="/registration" className="auth__notAuthLink">
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Auth;
