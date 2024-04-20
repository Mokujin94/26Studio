import React, { useContext, useEffect, useRef, useState } from "react";

import { Player } from '@lordicon/react'

import style from "./header.module.scss";

import logo from "../../resource/graphics/icons/footer/footer_logo.svg";
import searchIcon from '../../resource/graphics/icons/header/search.json';
import CreateButtonPopUp from "../createButtonPopUp/CreateButtonPopUp";
import burger from "../../resource/graphics/icons/burgerMenu/burger.svg";
import { Context } from "../..";
import ThemeChangeButton from "../themeChangeButton/ThemeChangeButton";
import SearchAll from "../searchAll/SearchAll";
import { useDebounce } from "../../hooks/useDebounce";
import { searchAll } from "../../http/searchAPI";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Link } from "react-router-dom";
import { NEWS_ROUTE } from "../../utils/consts";
import Notification from "../notification/Notification";

function Header() {
	const { user } = useContext(Context);

	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [activeCreatePopup, setActiveCreatePopup] = useState(false);

	const [activeNotifications, setActiveNotifications] = useState(false)

	const [searchOpen, setSearchOpen] = useState(false);

	const [searchData, setSearchData] = useState({});

	const [isFocusSearch, setIsFocusSearch] = useState(false);

	const [isAnimLogo, setIsAnimLogo] = useState(false);

	const useDebounced = useDebounce(search, 200);

	const createPopupRef = useRef(null);

	const notificationsRef = useRef(null)

	const searchIconRef = useRef(null)

	const nodeRef = useRef(null);

	useClickOutside(nodeRef, () => {
		setSearchOpen(false);
		setIsFocusSearch(false)
	});

	useClickOutside(createPopupRef, () => {
		setActiveCreatePopup(false);
	});

	useClickOutside(notificationsRef, () => {
		setActiveNotifications(false);
	});

	useEffect(() => {
		setIsLoading(true);
		searchAll(useDebounced).then((data) => {
			setSearchData(data);
			setIsLoading(false);
		});
	}, [useDebounced]);

	useEffect(() => {
		setIsLoading(true);
	}, [search]);

	const onHoveringLogo = () => {
		if (isAnimLogo) return;
		setIsAnimLogo(true);
		setTimeout(() => {
			setIsAnimLogo(false);
		}, 2000);
	}

	return (
		<header className={style.header}>
			<div className="container">
				<div className={style.header__wrapper}>
					<div
						className={style.header__burgerBtn}
						onClick={() => user.setBurgerActive(!user.burgerActive)}
						style={{ userSelect: "none" }}
					>
						<img src={burger} alt="icon" />
					</div>
					<Link to={NEWS_ROUTE} onMouseEnter={onHoveringLogo} className={isAnimLogo ? style.header__logo + ' ' + style.header__logo_onHover : style.header__logo}>
						{/* <img src={logo} alt="logo" /> */}
						<svg onHo height="40" viewBox="0 0 494 117" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3.552 93V86.472L30.912 60.072C33.344 57.768 35.136 55.752 36.288 54.024C37.504 52.232 38.304 50.6 38.688 49.128C39.136 47.592 39.36 46.12 39.36 44.712C39.36 41.256 38.144 38.536 35.712 36.552C33.28 34.568 29.728 33.576 25.056 33.576C21.472 33.576 18.24 34.184 15.36 35.4C12.48 36.552 9.984 38.376 7.872 40.872L1.344 35.208C3.904 31.944 7.328 29.448 11.616 27.72C15.968 25.928 20.736 25.032 25.92 25.032C30.592 25.032 34.656 25.8 38.112 27.336C41.568 28.808 44.224 30.952 46.08 33.768C48 36.584 48.96 39.912 48.96 43.752C48.96 45.928 48.672 48.072 48.096 50.184C47.52 52.296 46.432 54.536 44.832 56.904C43.232 59.272 40.928 61.928 37.92 64.872L13.536 88.392L11.232 84.648H51.84V93H3.552ZM87.8633 93.768C81.9113 93.768 76.8233 92.456 72.5993 89.832C68.3753 87.208 65.1433 83.432 62.9033 78.504C60.7273 73.512 59.6393 67.432 59.6393 60.264C59.6393 52.648 60.9833 46.216 63.6713 40.968C66.3593 35.72 70.1033 31.752 74.9033 29.064C79.7033 26.376 85.2073 25.032 91.4153 25.032C94.6153 25.032 97.6553 25.352 100.535 25.992C103.479 26.632 106.007 27.624 108.119 28.968L104.471 36.456C102.743 35.24 100.759 34.408 98.5193 33.96C96.3433 33.512 94.0393 33.288 91.6073 33.288C84.7593 33.288 79.3193 35.432 75.2873 39.72C71.2553 43.944 69.2393 50.248 69.2393 58.632C69.2393 59.976 69.3033 61.576 69.4313 63.432C69.5593 65.288 69.8793 67.112 70.3913 68.904L67.1273 65.64C68.0873 62.696 69.5913 60.232 71.6393 58.248C73.7513 56.2 76.2473 54.696 79.1273 53.736C82.0713 52.712 85.2393 52.2 88.6313 52.2C93.1113 52.2 97.0793 53.032 100.535 54.696C103.991 56.36 106.711 58.728 108.695 61.8C110.679 64.808 111.671 68.392 111.671 72.552C111.671 76.84 110.615 80.584 108.503 83.784C106.391 86.984 103.543 89.448 99.9593 91.176C96.3753 92.904 92.3433 93.768 87.8633 93.768ZM87.4793 85.992C90.4233 85.992 92.9833 85.448 95.1593 84.36C97.3993 83.272 99.1593 81.768 100.439 79.848C101.719 77.864 102.359 75.56 102.359 72.936C102.359 68.968 100.983 65.832 98.2313 63.528C95.4793 61.16 91.7353 59.976 86.9993 59.976C83.9273 59.976 81.2393 60.552 78.9353 61.704C76.6313 62.856 74.8073 64.424 73.4633 66.408C72.1833 68.328 71.5433 70.536 71.5433 73.032C71.5433 75.336 72.1513 77.48 73.3673 79.464C74.5833 81.384 76.3753 82.952 78.7433 84.168C81.1113 85.384 84.0233 85.992 87.4793 85.992Z" fill="#97BCE6" />
							<path d="M149.664 93.768C144.544 93.768 139.648 93 134.976 91.464C130.304 89.864 126.624 87.816 123.936 85.32L127.488 77.832C130.048 80.072 133.312 81.928 137.28 83.4C141.248 84.872 145.376 85.608 149.664 85.608C153.568 85.608 156.736 85.16 159.168 84.264C161.6 83.368 163.392 82.152 164.544 80.616C165.696 79.016 166.272 77.224 166.272 75.24C166.272 72.936 165.504 71.08 163.968 69.672C162.496 68.264 160.544 67.144 158.112 66.312C155.744 65.416 153.12 64.648 150.24 64.008C147.36 63.368 144.448 62.632 141.504 61.8C138.624 60.904 135.968 59.784 133.536 58.44C131.168 57.096 129.248 55.304 127.776 53.064C126.304 50.76 125.568 47.816 125.568 44.232C125.568 40.776 126.464 37.608 128.256 34.728C130.112 31.784 132.928 29.448 136.704 27.72C140.544 25.928 145.408 25.032 151.296 25.032C155.2 25.032 159.072 25.544 162.912 26.568C166.752 27.592 170.08 29.064 172.896 30.984L169.728 38.664C166.848 36.744 163.808 35.368 160.608 34.536C157.408 33.64 154.304 33.192 151.296 33.192C147.52 33.192 144.416 33.672 141.984 34.632C139.552 35.592 137.76 36.872 136.608 38.472C135.52 40.072 134.976 41.864 134.976 43.848C134.976 46.216 135.712 48.104 137.184 49.512C138.72 50.92 140.672 52.04 143.04 52.872C145.472 53.704 148.128 54.472 151.008 55.176C153.888 55.816 156.768 56.552 159.648 57.384C162.592 58.216 165.248 59.304 167.616 60.648C170.048 61.992 172 63.784 173.472 66.024C174.944 68.264 175.68 71.144 175.68 74.664C175.68 78.056 174.752 81.224 172.896 84.168C171.04 87.048 168.16 89.384 164.256 91.176C160.416 92.904 155.552 93.768 149.664 93.768ZM202.112 93V34.152H179.072V25.8H234.656V34.152H211.616V93H202.112ZM271.733 93.768C262.901 93.768 255.957 91.24 250.901 86.184C245.845 81.128 243.317 73.736 243.317 64.008V25.8H252.917V63.624C252.917 71.112 254.549 76.584 257.812 80.04C261.141 83.496 265.813 85.224 271.829 85.224C277.909 85.224 282.581 83.496 285.845 80.04C289.173 76.584 290.837 71.112 290.837 63.624V25.8H300.149V64.008C300.149 73.736 297.621 81.128 292.565 86.184C287.573 91.24 280.629 93.768 271.733 93.768ZM319.83 93V25.8H348.15C355.318 25.8 361.622 27.208 367.062 30.024C372.566 32.84 376.822 36.776 379.83 41.832C382.902 46.888 384.438 52.744 384.438 59.4C384.438 66.056 382.902 71.912 379.83 76.968C376.822 82.024 372.566 85.96 367.062 88.776C361.622 91.592 355.318 93 348.15 93H319.83ZM329.43 84.648H347.574C353.142 84.648 357.942 83.592 361.974 81.48C366.07 79.368 369.238 76.424 371.478 72.648C373.718 68.808 374.838 64.392 374.838 59.4C374.838 54.344 373.718 49.928 371.478 46.152C369.238 42.376 366.07 39.432 361.974 37.32C357.942 35.208 353.142 34.152 347.574 34.152H329.43V84.648ZM399.143 93V25.8H408.743V93H399.143Z" fill="white" />
							<path className={style.header__logoCircle} d="M448.5 41.9747C451.552 40.0885 455.149 39 459 39C470.046 39 479 47.9543 479 59C479 70.0457 470.046 79 459 79C451.3 79 444.616 74.6484 441.274 68.2703L439.083 74.1122C443.649 80.1206 450.871 84 459 84C472.807 84 484 72.8071 484 59C484 45.1929 472.807 34 459 34C455.25 34 451.693 34.8257 448.5 36.3053V41.9747Z" fill="#FCFCFC" />
							<path className={style.header__logoCircle} d="M473.227 85.4187C468.993 87.7033 464.148 89 459 89C442.431 89 429 75.5685 429 59C429 42.4315 442.431 29 459 29C475.569 29 489 42.4315 489 59C489 60.1839 488.931 61.3519 488.798 62.5H493.827C493.941 61.3488 494 60.1812 494 59C494 39.67 478.33 24 459 24C439.67 24 424 39.67 424 59C424 78.33 439.67 94 459 94C465.439 94 471.472 92.2612 476.655 89.2275L473.227 85.4187Z" fill="#97BCE6" />
							<rect x="432" y="50" width="55" height="18" fill="#1B232C" />
							<path d="M430.826 67V51.6H438.35C440.286 51.6 441.738 51.9667 442.706 52.7C443.689 53.4333 444.18 54.4013 444.18 55.604C444.18 56.4107 443.982 57.1147 443.586 57.716C443.19 58.3027 442.647 58.7573 441.958 59.08C441.269 59.4027 440.477 59.564 439.582 59.564L440 58.662C440.968 58.662 441.826 58.8233 442.574 59.146C443.322 59.454 443.901 59.916 444.312 60.532C444.737 61.148 444.95 61.9033 444.95 62.798C444.95 64.118 444.429 65.152 443.388 65.9C442.347 66.6333 440.814 67 438.79 67H430.826ZM434.368 64.316H438.526C439.45 64.316 440.147 64.1693 440.616 63.876C441.1 63.568 441.342 63.084 441.342 62.424C441.342 61.7787 441.1 61.302 440.616 60.994C440.147 60.6713 439.45 60.51 438.526 60.51H434.104V57.914H437.91C438.775 57.914 439.435 57.7673 439.89 57.474C440.359 57.166 440.594 56.704 440.594 56.088C440.594 55.4867 440.359 55.0393 439.89 54.746C439.435 54.438 438.775 54.284 437.91 54.284H434.368V64.316ZM450.926 57.804H458.34V60.576H450.926V57.804ZM451.19 64.14H459.572V67H447.648V51.6H459.286V54.46H451.19V64.14ZM465.598 67V54.504H460.67V51.6H474.09V54.504H469.162V67H465.598ZM473.21 67L480.074 51.6H483.594L490.48 67H486.74L481.108 53.404H482.516L476.862 67H473.21ZM476.642 63.7L477.588 60.994H485.508L486.476 63.7H476.642Z" fill="#FCFCFC" />
						</svg>


					</Link>
					<div className={style.header__search} ref={nodeRef}>
						<input
							className={style.header__search__input}
							placeholder="Поиск по сайту"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onFocus={(event) => {
								event.target.setAttribute("autocomplete", "off");
								setSearchOpen(true);
								searchIconRef.current.playFromBeginning()
								setIsFocusSearch(true)
							}}
						/>
						<div className={style.header__search__icon}>
							<Player direction={1} colorize={isFocusSearch ? "#97bce6" : "#596470"} size={24} ref={searchIconRef} icon={searchIcon} />
						</div>
						{/* <img
							src={searchIcon}
							alt="icon"
							className={style.header__search__icon}
						/> */}
						{searchOpen && (
							<SearchAll
								search={search}
								searchData={searchData}
								isLoading={isLoading}
							/>
						)}
					</div>
					<div className={style.header__createButtonPopUp}>
						{
							user.isAuth
							&&
							<>
								<Notification
									notificationsRef={notificationsRef}
									setActiveNotifications={setActiveNotifications}
									activeNotifications={activeNotifications}
								/>
								<CreateButtonPopUp
									createPopupRef={createPopupRef}
									setActiveCreatePopup={setActiveCreatePopup}
									activeCreatePopup={activeCreatePopup}
								/>
								{/* <ThemeChangeButton /> */}
							</>
						}
					</div>
				</div>
			</div>
		</header>
	);
}

export default Header;
