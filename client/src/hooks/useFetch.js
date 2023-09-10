import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

const useFetch = (keyword = "") => {
  const [gifUrl, setgifUrl] = useState("");

  const fetchGif = async () => {
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );

      const { data } = await res.json();

      setgifUrl(data[0].images?.downsized_medium?.url);
    } catch (error) {
      console.log(error);
      setgifUrl(
        "https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif"
      );
    }
  };

  useEffect(() => {
    if (keyword) fetchGif();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
