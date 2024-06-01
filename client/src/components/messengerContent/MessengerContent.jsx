import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import style from './messengerContent.module.scss'
import MessengerInteraction from '../messengerInteraction/MessengerInteraction'
import Message from '../message/Message'
import { useLocation } from 'react-router-dom'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { fetchPersonalChat, onReadMessage } from '../../http/messengerAPI'
import { useDayMonthFormatter } from '../../hooks/useDayMonthFormatter'
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group'
import Spinner from '../spinner/Spinner'
import MessageContextMenu from '../messageContextMenu/MessageContextMenu'
const MessengerContent = observer(({ chats, setChatData, chatData, otherUserData, setOtherUserData, messages, setMessages, hash, windowChat, totalCountMessages, setTotalCountMessages, setMessagesOffset, setIsFetchingMessages, setIsLoadingMessages, isLoadingMessages, isScrollBottom }) => {

	const { user } = useContext(Context)
	const [isWriting, setIsWriting] = useState(false)
	const [notReadMessages, setNotReadMessages] = useState([])

	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		messageId: null,
	});

	const handleContextMenu = (event, messageId) => {
		event.preventDefault();
		const containerRect = windowChat.current.getBoundingClientRect();
		const scrollTop = windowChat.current.scrollTop;
		const scrollLeft = windowChat.current.scrollLeft;
		setContextMenu({
			visible: true,
			x: event.clientX - containerRect.left + scrollLeft,
			y: event.clientY - containerRect.top + scrollTop,
			messageId,
		});
	};

	const handleCloseContextMenu = () => {
		setContextMenu(prev => {
			return { ...prev, visible: false, messageId: null }


		});
	};

	const handleReply = (messageId) => {
		alert(`Ответить на сообщение с ID: ${messageId}`);
		handleCloseContextMenu();
	};

	const handleCopy = (messageId) => {
		messages.map(group => {
			group.map(msg => {
				if (msg.id === messageId) {
					navigator.clipboard.writeText(msg.text)
				}
			})
		})
		handleCloseContextMenu();
	};

	useEffect(() => {
		user.socket.on("incReadMessege", (message) => {
			if (message.chatId !== chatData.id) return;
			setNotReadMessages(prevMessages => {
				if (message.userId === user.user.id) return prevMessages;
				return [...prevMessages, message]
			})
		})
		user.socket.on("getNotReadMessage", (message) => {
			setNotReadMessages(prevMessages => {
				return prevMessages.filter(messageRead => messageRead.id !== message.id)
			})
		})
	}, [user.socket, chatData])

	useEffect(() => {
		chats.map(chat => {
			chat.members.filter(item => {
				if (item.id !== user.user.id && item.id === hash) {
					setOtherUserData(item)
				}
			})
		})

		if (!hash) return;
		fetchPersonalChat(Number(hash), user.user.id).then(data => {
			setChatData(data);
			// setOtherUserData(data.member)
			setMessages(data.messages);
			setTotalCountMessages(data.countMessages)

			setMessagesOffset(2)
			setIsLoadingMessages(false)
		})
	}, [Number(hash)])

	useEffect(() => {
		user.socket.on("getWriting", ({ chatId, isWriting }) => {
			if (chatId !== chatData.id) return;
			setIsWriting(isWriting);
		})
		setTotalCountMessages(chatData.countMessages)
		setMessagesOffset(2)
		if (windowChat.current) {
			windowChat.current.scrollTo({
				top: windowChat.current.scrollHeight,
			});
		}


	}, [chatData, windowChat.current])

	useEffect(() => {

		chats.map(chat => {
			chat.members.filter(item => {
				if (item.id !== user.user.id && item.id === hash) {
					setOtherUserData(item)
				}
			})
		})
	}, [chats])

	const handleVisible = async (messageId) => {
		const totalElements = messages.reduce((acc, arr) => acc + arr.length, 0);

		if (messages[0][0].id === messageId && totalElements < totalCountMessages) {
			setIsFetchingMessages(true)
		}
		messages.map((group) => {
			return group.map(async (message) => {
				if (message.id === messageId && message.userId !== user.user.id) {
					await onReadMessage(Number(user.user.id), Number(messageId)).catch((e) => {
						console.log(e)
					})
					message.isRead = true;
					user.socket.emit("onReadMessage", { message: message, recipientId: hash }); // Объединяем старое и новое сообщение
					user.socket.emit("onNotReadMessage", { message: message, recipientId: user.user.id }); // Объединяем старое и новое сообщение
				}
				return message;
			});
		});


	};

	const scrollToBottom = useCallback(() => {
		if (windowChat.current) {
			windowChat.current.scrollTop = windowChat.current.scrollHeight - windowChat.current.clientHeight - 299;
			windowChat.current.scrollTo({
				top: windowChat.current.scrollHeight,
				behavior: "smooth",
			});

		}
	}, [windowChat.current])

	// Функция для проверки, различаются ли две даты по дню
	const isDifferentDay = (date1, date2) => {
		return (
			date1.getFullYear() !== date2.getFullYear() ||
			date1.getMonth() !== date2.getMonth() ||
			date1.getDate() !== date2.getDate()
		);
	};
	const contentOutsideChat =
		<div className={style.content__inner}>
			<span className={style.content__innerText}>Выберите, кому хотели бы написать</span>
		</div>

	const contentChat =
		<>
			<div className={style.content__header}>
				<div className={style.content__headerInfo}>

					<span className={style.content__headerInfoName}>{Number(hash) === user.user.id ? "Избранное" : otherUserData.name}</span>
					{
						isWriting ? (
							<span className={style.content__headerInfoOnline + " " + style.content__headerInfoOnline_writing}>
								Печатает
							</span>
						) : (
							<span className={style.content__headerInfoOnline}>
								Онлайн
							</span>
						)

					}

				</div>
			</div>


			<div className={style.content__inner} onClick={handleCloseContextMenu} ref={windowChat}>
				{/* {renderMessagesWithDate()} */}
				{isLoadingMessages &&
					<div style={{ margin: "0 auto" }}>
						<Spinner />
					</div>
				}
				<TransitionGroup component={null}>
					{
						messages.map((messageGroup, index) => {
							const groupDate = messageGroup[messageGroup.length - 1].createdAt;
							const lastGroup = messages[index - 1];
							const lastGroupDate = lastGroup ? lastGroup[lastGroup.length - 1].createdAt : null;

							const key = `message-group-${messageGroup[0].id}`;

							if (lastGroupDate && isDifferentDay(new Date(groupDate), new Date(lastGroupDate))) {
								return (
									<CSSTransition
										key={key}
										in={!!hash}
										timeout={0}
									>
										<>
											<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
												{useDayMonthFormatter(groupDate)}
											</div>
											<Message contextMenu={contextMenu} onContextMenu={handleContextMenu} isScrollBottom={isScrollBottom} windowChatRef={windowChat} messages={messageGroup} handleVisible={handleVisible} />
										</>
									</CSSTransition>
								)
							} else if (!lastGroupDate) {
								return (
									<CSSTransition
										key={key}
										in={!!hash}
										timeout={0}
									>
										<>
											<div key={`date-${lastGroupDate}`} className={style.content__inner_date}>
												{useDayMonthFormatter(groupDate)}
											</div>
											<Message contextMenu={contextMenu} onContextMenu={handleContextMenu} isScrollBottom={isScrollBottom} windowChatRef={windowChat} messages={messageGroup} handleVisible={handleVisible} />
										</>
									</CSSTransition>
								)

							} else return (
								<CSSTransition
									key={key}
									in={!!hash}
									timeout={0}
								>
									<Message contextMenu={contextMenu} onContextMenu={handleContextMenu} isScrollBottom={isScrollBottom} windowChatRef={windowChat} messages={messageGroup} handleVisible={handleVisible} />
								</CSSTransition>
							)

						})
					}
				</TransitionGroup>

				<CSSTransition
					in={contextMenu.visible}
					timeout={300}
					classNames="create-anim"
					unmountOnExit
					mountOnEnter
				>
					<MessageContextMenu
						messageId={contextMenu.messageId}
						position={{ x: contextMenu.x, y: contextMenu.y }}
						onClose={handleCloseContextMenu}
						onReply={handleReply}
						onCopy={handleCopy}
					/>
				</CSSTransition>

			</div >




			<div className={style.content__bottom}>
				<CSSTransition
					in={!isScrollBottom}
					timeout={300}
					classNames="create-anim"
					unmountOnExit
					mountOnEnter
				>
					<div className={style.content__innerScrollButton} onClick={scrollToBottom}>
						<CSSTransition
							in={!!notReadMessages.length > 0}
							timeout={300}
							classNames="create-anim"
							unmountOnExit
							mountOnEnter
						>
							<span style={{ minWidth: notReadMessages.length.length * 11 }} className={style.content__innerScrollButtonNotReadCount}>{notReadMessages.length}</span>
						</CSSTransition>
						<svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none">
							<path d="M1.5 1.5L7.26263 7.93043C7.94318 8.68986 9.05682 8.68986 9.73737 7.93043L15.5 1.5" stroke="#97BCE6" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round">
							</path>
						</svg>
					</div>
				</CSSTransition>
				<MessengerInteraction chat={chatData} setMessages={setMessages} isScrollBottom={isScrollBottom} windowChatRef={windowChat} />
			</div>
		</>
	return (
		<div className={style.content}>
			{
				hash
					?
					contentChat
					:
					contentOutsideChat
			}
		</div>
	)
})

export default MessengerContent