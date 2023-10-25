import React, { useContext, useEffect, useState } from "react";

import style from "./firstStageReg.module.scss";

import eye from "../../resource/graphics/icons/registration/regEye.svg";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
const FirstStageReg = observer(() => {
  const { user } = useContext(Context);

  const [valueName, setValueName] = useState(user.dataAuth.name);
  const [valueFullName, setValueFullName] = useState(user.dataAuth.fullName);
  const [valueMail, setValueMail] = useState(user.dataAuth.email);
  const [valuePassword, setValuePassword] = useState(user.dataAuth.password);
  const [valuePasswordConfirm, setValuePasswordConfirm] = useState(
    user.dataAuth.passwordConfirm
  );

  const [newData, setNewData] = useState({});

  useEffect(() => {
    setNewData({
      name: valueName,
      fullName: valueFullName,
      email: valueMail,
      password: valuePassword,
      passwordConfirm: valuePasswordConfirm,
    });
  }, [
    valueName,
    valueFullName,
    valueMail,
    valuePassword,
    valuePasswordConfirm,
  ]);

  useEffect(() => {
    user.setDataAuth({ ...user.dataAuth, ...newData });
  }, [newData]);

  const validationName = (e) => {
    setValueName(e.target.value);
    let match = /^[a-z]*$/i.test(e.target.value.replaceAll(" ", ""));
    if (e.target.value.length < 4) {
      const newError = {
        id: 0,
        errors: [{ id: 0, name: "Никнейм должен содержать минимум 4 символа" }],
      };
      user.setErrorAuth(newError);
    } else if (!match) {
      const newError = {
        id: 0,
        errors: [{ id: 0, name: "Никнейм должен содержать латинские буквы" }],
      };
      user.setErrorAuth(newError);
    } else {
      const newError = {
        id: 0,
        errors: [],
      };
      user.setErrorAuth(newError);
    }
  };

  const validationFullName = (e) => {
    setValueFullName(e.target.value);
    let match = /^[а-яё]*$/i.test(e.target.value.replaceAll(" ", ""));
    let secondSpace = e.target.value.indexOf(
      " ",
      1 + e.target.value.indexOf(" ")
    );
    let firstWord = e.target.value.slice(
      0,
      e.target.value.indexOf(" ") === -1
        ? e.target.value.length
        : e.target.value.indexOf(" ") + 1
    );
    let checkSpaceFristWord = firstWord.indexOf(" ");
    let secondWord = e.target.value.slice(
      firstWord.length,
      secondSpace === -1 ? e.target.value.length : secondSpace + 1
    );
    let checkSpaceSecondWord = secondWord.indexOf(" ");
    let thirdWord = e.target.value.slice(
      secondSpace === -1 ? e.target.value.length + 1 : secondSpace + 1,
      e.target.value.length
    );
    let checkSpaceThirdWord = thirdWord.indexOf(" ");
    if (
      checkSpaceFristWord === 0 ||
      checkSpaceSecondWord === 0 ||
      checkSpaceThirdWord !== -1 ||
      (secondSpace !== -1 && !thirdWord) ||
      (thirdWord && checkSpaceSecondWord === -1)
    ) {
      const newError = {
        id: 1,
        errors: [
          {
            id: 1,
            name: "ФИО не должно содержать пробелы в начале или в конце",
          },
        ],
      };
      user.setErrorAuth(newError);
    } else if (!secondWord || !match || checkSpaceFristWord === -1) {
      const newError = {
        id: 1,
        errors: [
          {
            id: 1,
            name: "Фамилия и имя обязательны для заполнения (киррилица)",
          },
        ],
      };
      user.setErrorAuth(newError);
    } else if (firstWord.length < 3 || (secondWord && secondWord.length < 2)) {
      const newError = {
        id: 1,
        errors: [
          {
            id: 1,
            name: "Некорректное ФИО",
          },
        ],
      };
      user.setErrorAuth(newError);
    } else {
      const newError = {
        id: 1,
        errors: [],
      };
      user.setErrorAuth(newError);
    }
  };

  const validationMail = (e) => {
    setValueMail(e.target.value);
    let checkMail = e.target.value.indexOf("@");
    let beforeMailWord = e.target.value.slice(
      0,
      checkMail !== -1 ? checkMail : e.target.value.length
    );
    let afterMail = e.target.value.slice(
      beforeMailWord.length + 1,
      e.target.value.length
    );

    let afterMailWord = e.target.value.slice(
      checkMail !== -1 ? checkMail + 1 : e.target.value.length + 1,
      e.target.value.length
    );
    let checkDot = afterMailWord.indexOf(".");
    let afterDot = afterMailWord.slice(
      checkDot !== -1 ? checkDot + 1 : e.target.value.length + 1,
      e.target.value.length
    );
    if (
      !checkMail ||
      !beforeMailWord ||
      !afterMailWord ||
      !checkDot ||
      afterDot.length < 2
    ) {
      const newError = {
        id: 2,
        errors: [
          {
            id: 1,
            name: "Не корректная почта",
          },
        ],
      };
      user.setErrorAuth(newError);
    } else {
      const newError = {
        id: 2,
        errors: [],
      };
      user.setErrorAuth(newError);
    }
  };

  const validationPassword = (e) => {
    setValuePassword(e.target.value);
    if (e.target.value.length < 6) {
      const newError = {
        id: 3,
        errors: [
          {
            id: 1,
            name: "Длина пароля не менее 6 символов",
          },
        ],
      };
      user.setErrorAuth(newError);
    } else {
      const newError = {
        id: 3,
        errors: [],
      };
      user.setErrorAuth(newError);
    }
  };

  const validationPasswordConfirm = (e) => {
    setValuePasswordConfirm(e.target.value);
    if (e.target.value !== valuePassword) {
      const newError = {
        id: 4,
        errors: [
          {
            id: 1,
            name: "Пароли не совпадают",
          },
        ],
      };
      user.setErrorAuth(newError);
    } else {
      const newError = {
        id: 4,
        errors: [],
      };
      user.setErrorAuth(newError);
    }
  };
  return (
    <>
      <div className={style.first}>
        <div className={style.first__inner}>
          <div className={style.first__row}>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Никнейм</h3>
              <input
                value={valueName}
                onChange={validationName}
                type="text"
                required
                className={style.first__itemInput}
                style={
                  user.errorAuth[0].errors.length && user.dataAuth.name
                    ? { border: "2px solid rgb(255, 149, 149)" }
                    : null
                }
              />
              <p className={style.error_message}>
                {user.errorAuth[0].errors.length && user.dataAuth.name
                  ? user.errorAuth[0].errors[0].name
                  : null}
              </p>
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>ФИО</h3>
              <input
                value={valueFullName}
                onChange={validationFullName}
                type="text"
                className={style.first__itemInput}
                style={
                  user.errorAuth[1].errors.length && user.dataAuth.fullName
                    ? { border: "2px solid rgb(255, 149, 149)" }
                    : null
                }
              />
              <p className={style.error_message}>
                {user.errorAuth[1].errors.length && user.dataAuth.fullName
                  ? user.errorAuth[1].errors[0].name
                  : null}
              </p>
            </label>
          </div>
          <label className={`${style.first__item} ${style.first__itemEmail}`}>
            <h3 className={style.first__itemTitle}>Почта</h3>
            <input
              value={valueMail}
              onChange={validationMail}
              type="email"
              className={style.first__itemInput}
              style={
                user.errorAuth[2].errors.length && user.dataAuth.email
                  ? { border: "2px solid rgb(255, 149, 149)" }
                  : null
              }
            />
            <p className={style.error_message}>
              {user.errorAuth[2].errors.length && user.dataAuth.email
                ? user.errorAuth[2].errors[0].name
                : null}
            </p>
          </label>
          <div className={style.first__row}>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Пароль</h3>
              <div className={style.first__itemBottom}>
                <div className={style.first__itemWrapper}>
                  <input
                    value={valuePassword}
                    onChange={validationPassword}
                    type="password"
                    className={`${style.first__itemInput} ${style.first__itemInputPass}`}
                    style={
                      user.errorAuth[3].errors.length && user.dataAuth.password
                        ? { border: "2px solid rgb(255, 149, 149)" }
                        : null
                    }
                  />
                  <img src={eye} alt="" />
                </div>

                <p className={style.error_message}>
                  {user.errorAuth[3].errors.length && user.dataAuth.password
                    ? user.errorAuth[3].errors[0].name
                    : null}
                </p>
              </div>
            </label>
            <label className={style.first__item}>
              <h3 className={style.first__itemTitle}>Повтор пароля</h3>
              <div className={style.first__itemBottom}>
                <div className={style.first__itemWrapper}>
                  <input
                    value={valuePasswordConfirm}
                    onChange={validationPasswordConfirm}
                    type="password"
                    className={`${style.first__itemInput} ${style.first__itemInputPass}`}
                    style={
                      user.errorAuth[4].errors.length &&
                      user.dataAuth.passwordConfirm
                        ? { border: "2px solid rgb(255, 149, 149)" }
                        : null
                    }
                  />
                  <img src={eye} alt="" />
                </div>
                <p className={style.error_message}>
                  {user.errorAuth[4].errors.length &&
                  user.dataAuth.passwordConfirm
                    ? user.errorAuth[4].errors[0].name
                    : null}
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
});

export default FirstStageReg;
