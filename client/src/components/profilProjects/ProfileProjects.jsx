import React, { useEffect, useState } from "react";

import projectPhoto from "../../resource/graphics/images/projectCard/bg.jpg";

import ProjectCard from "../projectCard/ProjectCard";
import { observer } from "mobx-react-lite";
import { fetchProjectsUser } from "../../http/projectAPI";
import { Link, useLocation, useParams } from "react-router-dom";
import { PROJECTS_ROUTE } from "../../utils/consts";

import style from './profileProjects.module.scss'

const ProfileProjects = observer(() => {
  const { id } = useParams();
  const location = useLocation();
  const [dataProjects, setDataProjects] = useState([]);
  useEffect(() => {
    fetchProjectsUser(id).then((data) => setDataProjects(data.projects));
  }, [location.pathname]);
  return (
    <>
      {dataProjects.length ? (
        dataProjects.map((item) => {
        return (
          <Link to={PROJECTS_ROUTE + "/" + item.id} key={item.id}>
            <ProjectCard
              img={item.preview}
              title={item.name}
              date={item.start_date}
              like={item.likes.length}
              view={item.views.length}
              comment={item.comments.length}
            />
          </Link>
        );
      })
      ) : (
        <div className={style.projects}>
          <h2 className={style.projects__title}>У вас нет друзей</h2>
        </div>
      )}
    </>
  );
});

export default ProfileProjects;
