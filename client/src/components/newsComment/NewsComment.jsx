import React, { useCallback, useContext, useEffect, useState } from "react";

import style from "./newsComment.module.scss";
import { Link } from "react-router-dom";
import { PROFILE_ROUTE } from "../../utils/consts";
import FunctionButton from "../functionButton/FunctionButton";
import { CSSTransition } from "react-transition-group";
import { createReply, deleteLike, like } from "../../http/commentsAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import ReplyComment from "../replyComment/ReplyComment";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { useCountFormatter } from "../../hooks/useCountFormatter";

const NewsComment = observer((props) => {
	const { user } = useContext(Context);

	const [isReply, setIsReply] = useState(false);
	const [isReplyOpen, setIsReplyOpen] = useState(false);
	const [replyText, setReplyText] = useState('');
	const [replyes, setReplyes] = useState([]);
	const [likesCount, setLikesCount] = useState(0);
	const [isLike, setIsLike] = useState(false);

	const likesFormated = useCountFormatter(likesCount)

	const onReply = async () => {
		await createReply(replyText, user.user.id, props.commentId, null, props.projectId).then(() => {
			setIsReply(false)
			setReplyText('')
		}).catch(err => console.log(err))
	}

	useEffect(() => {
		if (props.replyes) {
			setReplyes(props.replyes)
		}

		if (props.likes) {
			const likes = props.likes.filter(item => item.status)
			setLikesCount(likes.length)
		}
	}, [])

	useEffect(() => {
		props.likes.filter(item => {
			if (item.userId === user.user.id && item.status && item.commentId === props.commentId) {
				setIsLike(true)
			}
		})
	}, [props.likes])

	useEffect(() => {
		if (props.lastReplyComment.parentId === props.commentId) {
			setReplyes((item) => [...item, props.lastReplyComment]);
		}
	}, [props.lastReplyComment])

	const onLike = useCallback(async () => {
		setIsLike(prevIsLike => !prevIsLike); // Обновляем состояние isLike, используя предыдущее значение
		console.log(isLike)
		if (isLike) {
			setLikesCount(prev => prev - 1);

			try {
				const data = await deleteLike(props.commentId, user.user.id);
				// console.log(data);
			} catch (err) {
				// console.log(err);
			}

		} else {
			setLikesCount(prev => prev + 1);

			try {
				const data = await like(props.commentId, user.user.id);
				// console.log(data);
			} catch (err) {
				// console.log(err);
			}
		}
	}, [isLike, props.commentId, user.user.id, setIsLike, setLikesCount]);


	return (
		<div className={style.block} >
			<div className={style.block__text}>
				<Link
					to={PROFILE_ROUTE + "/" + props.id}
					className={style.block__avatar}
				>
					<img
						className={style.block__avatarImg}
						src={process.env.REACT_APP_API_URL + props.avatar}
						alt="avatar"
					/>
				</Link>
				<div className={style.block__top__info}>
					<Link
						to={PROFILE_ROUTE + "/" + props.id}
						className={style.block__textName}
					>
						{props.name}
					</Link>
					<div className={style.block__textBottomDate}>{props.date}</div>

				</div>

				<h2 className={style.block__textComment}>{props.comment}</h2>
			</div>
			<div className={style.block__textBottom}>
				<div className={style.block__textBottomFeedback}>
					<p onClick={() => setIsReply(true)} className={style.block__textBottomFeedbackItem}>Ответить</p>
					<div className={style.block__textBottomFeedbackLike} onClick={onLike}>
						<div className={style.block__textBottomFeedbackItemImage}>
							<svg className={isLike ? style.block__textBottomFeedbackItemImageIcon + ' ' + style.block__textBottomFeedbackItemImageIcon_active : style.block__textBottomFeedbackItemImageIcon} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 0C3.9875 0 2.64 0.741935 1.6225 1.90323C0.6325 3.06452 0 4.64516 0 6.45161C0 8.22581 0.6325 9.80645 1.6225 11L11 22L20.3775 11C21.3675 9.83871 22 8.25806 22 6.45161C22 4.67742 21.3675 3.09677 20.3775 1.90323C19.3875 0.741935 18.04 0 16.5 0C14.9875 0 13.64 0.741935 12.6225 1.90323C11.6325 3.06452 11 4.64516 11 6.45161C11 4.67742 10.3675 3.09677 9.3775 1.90323C8.3875 0.741935 7.04 0 5.5 0Z" fill="white"></path></svg>
						</div>
						<p className={style.block__textBottomFeedbackItemCount}>{likesFormated}</p>
					</div>

				</div>
			</div>
			<div className={style.block__input__wrapper} style={isReply ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" }}>
				<CSSTransition
					in={isReply}
					timeout={300}
					classNames="create-anim"
					unmountOnExit
				>
					<div className={style.block__input}>
						<div className={replyText ? style.block__input__item + ' ' + style.block__input__item_notEmpty : style.block__input__item} contenteditable="true" onInput={(e) => setReplyText(e.target.textContent)}></div>
						<div className={style.block__input__buttons}>
							<button onClick={() => setIsReply(false)} className={style.block__input__buttons__item + ' ' + style.block__input__buttons__item_border}>Отменить</button>
							<button onClick={onReply} className={style.block__input__buttons__item}>Отправить</button>
						</div>
					</div>
				</CSSTransition>
			</div>
			{!!replyes.length &&
				<div className={isReplyOpen ? style.block__replyes__btn + ' ' + style.block__replyes__btn_active : style.block__replyes__btn} onClick={() => setIsReplyOpen(prev => !prev)}>
					<span>{replyes.length} ответа</span>
				</div>
			}
			{
				isReplyOpen &&
				<div className={style.block__replyes__list}>
					{replyes && replyes.map(item => {
						return (
							<ReplyComment
								id={item.userId}
								name={item.user.name}
								avatar={item.user.avatar}
								comment={item.message}
								commentId={props.commentId}
								replyes={item.replyes}
								replyId={item.id}
								userReply={item.userReply}
								date={useDateFormatter(item.createdAt)}
								key={item.id}
								likes={item.likes}
							/>
						)
					})}
				</div>
			}
		</div>
	);
})

export default NewsComment;
