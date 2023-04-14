export const getArticleViewer = async (id: number | string) => {
  if (process?.env?.isBuild == "t") {
    console.log("构建环境，采用默认值");
    return {}
  }
  try {
    const url = `/api/public/article/viewer/${id}`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
  } catch (err) {
    if (process.env.isBuild == "t") {
      console.log("无法连接，采用默认值");
      return {};
    } else {
      throw err;
    }
  }
};
