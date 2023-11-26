import { $authHost, $host } from "./index";

export const fetchProject = async (pathFromProject, baseURL) => {
  const config = {
    params: {
      filePath: pathFromProject,
    },
  };
  const { data } = await $host.get("/api/user/accept_project", config);
  console.log(data);
  let pathWithForwardSlashes = baseURL.replace(/\\/g, "/");
  const correctedPath = pathWithForwardSlashes.replace(/^http:\//, "http://");
  console.log(pathWithForwardSlashes);
  // Преобразуем относительные пути в абсолютные
  const transformedContent = data.replace(
    /(<head>)/,
    (match, p1) => p1 + `<base href="${correctedPath}">`
  );

  const updatedLinks = transformedContent.replace(
    /(<link\s+.*?href=")(.*?)(".*?>)/g,
    (match, p1, p2, p3) => p1 + p2 + p3
  );

  return updatedLinks;
};

export const uploadFinishedProject = async (project) => {
  const { data } = await $host.post(
    "api/user/upload_finished_project",
    project
  );
  return data;
};

export const getAll = async () => {
  const { data } = await $host.get("api/project");
  return data;
};

export const fetchProjectById = async (id) => {
  const { data } = await $host.get("api/project/" + id);
  return data;
};
