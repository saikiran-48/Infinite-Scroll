import { useEffect, useState } from "react";
import { createClient, type PhotosWithTotalResults } from "pexels";
import { useInfiniteScroll } from "./useInfiniteScroll";
import "./app.css";

const client = createClient(import.meta.env.VITE_PEXELS_API_KEY);

type Photo = {
  id: number;
  src: {
    medium: string;
  };
};

export default function App() {
  const [images, setImages] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      if (loading) return;

      setLoading(true);

      const res = (await client.photos.curated({
        page,
        per_page: 6,
      })) as PhotosWithTotalResults;

      setImages((prev) => [...prev, ...res.photos]);
      setLoading(false);
    };

    fetchImages();
  },  [page]);

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
