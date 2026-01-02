import { useEffect, useState } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";
import "./App.css";

type Photo = {
  id: number;
  src: {
    medium: string;
  };
};

const API_KEY = "YOUR_PEXELS_API_KEY"; // TEMP: hardcode for now

export default function App() {
  const [images, setImages] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      if (loading) return;

      setLoading(true);

      const res = await fetch(
        `https://api.pexels.com/v1/curated?page=${page}&per_page=6`,
        {
          headers: {
            Authorization: API_KEY,
          },
        }
      );

      const data = await res.json();

      setImages((prev) => [...prev, ...data.photos]);
      setLoading(false);
    };

    fetchImages();
  }, [page]);

  const loaderRef = useInfiniteScroll(
    () => setPage((prev) => prev + 1),
    !loading
  );

  return (
    <div className="container">
      <h2 className="title">INFINITE GALLERY</h2>

      <div className="grid">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.src.medium}
            className="image"
            loading="lazy"
          />
        ))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
      </div>

      <div ref={loaderRef} className="loader-trigger" />
    </div>
  );
}
