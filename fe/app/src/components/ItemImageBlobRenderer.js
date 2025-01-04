import React, { useState, useEffect } from "react";

import config from "../config";

const ItemImageBlobRenderer = ({ item }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log("Trying to grab image for item", item.id, item.image_file);
        const timestamp = new Date().getTime();
        const response = await fetch(
          `${config.IMAGE_URL}/items/${item.id}/photo?t=${timestamp}`
        );
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchImage();
  }, []);

  return (
    <div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Fetched item ${item.id}`}
          width="75"
          height="75"
        />
      )}
    </div>
  );
};

export default ItemImageBlobRenderer;
