import React, { useState, useEffect } from "react";

const ItemImageBlobRenderer = ({ item }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log("Trying to grab image for item ", item);
        const response = await fetch(
          `http://127.0.0.1:5123/items/${item.id}/photo`
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
        <img src={imageUrl} alt="Fetched Image" width="75" height="75" />
      )}
    </div>
  );
};

export default ItemImageBlobRenderer;
