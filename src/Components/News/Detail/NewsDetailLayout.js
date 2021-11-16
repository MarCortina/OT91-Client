import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useParams } from "react-router";
import NewsTitle from "./NewsTittle";
import { Box } from "@mui/material";
import { getNewById } from "../../../Services/newsServices";
import LoadingSpinner from "../../../Utils/loadingSpinner";
import "../../../Styles/CardStyle.css";

const NewsImage = lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(import("./NewsImage")), 600)
    )
);

const NewsDetailLayout = () => {
  const [newData, setNewData] = useState({});
  const [newsDescription, setNewsDescription] = useState("");
  const [loading, setIsLoading] = useState(true);

  const { id } = useParams();

  const loadNewData = async () => {
    const { data } = await getNewById(id);
    setNewData(data);
  };

  const stripedHtml = useCallback(() => {
    newData.content &&
      setNewsDescription(newData.content.replace(/<[^>]+>/g, ""));
  }, [newData.content]);

  useEffect(() => {
    loadNewData();
    stripedHtml();
    setIsLoading(false);
  }, [id, stripedHtml]);

  return (
    <div>
      {loading ? (
        <div className="spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <NewsTitle title={newData.name} />
          <Suspense fallback={<LoadingSpinner />}>
            <NewsImage image={newData.image} />
          </Suspense>
          <Box>{newsDescription}</Box>
        </div>
      )}
    </div>
  );
};

export default NewsDetailLayout;
