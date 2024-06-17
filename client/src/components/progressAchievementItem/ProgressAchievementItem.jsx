import React from 'react';
import achievement from '../../resource/graphics/icons/achievements/achievement.png';
import style from './progressAchievementItem.module.scss';

function ProgressAchievementItem() {
  return (
    <div className={style.achievementProgress}>
      <div className={style.achievementProgress__progress}>30/30</div>
      <div className={style.achievementProgress__img}>
        <img src={achievement} alt="icon" />
      </div>
      <div className={style.achievementProgress__title}>Классное достижение</div>
    </div>
  );
}

export default ProgressAchievementItem;
