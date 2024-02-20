import React, { useState, useEffect } from "react";
import { Photo } from "../../graphql/types/types.generated";
import Image from "next/image";
import contentfulLoader from "../../lib/contentfulLoader";
import ExifSummary from "../ExifSummary";
import Link from "next/link";

interface MasonryProps {
  photos: Photo[];
}

const getNumColumns = (width) => {
  if (width < 768) return 1;
  if (width < 1280) return 2;
  return Math.min(Math.floor(width / 320), 3);
};

const Masonry = ({ photos }: MasonryProps) => {
  const [hasInitializedColumns, setHasInitializedColumns] = useState(false);
  const [numColumns, setNumColumns] = useState<number>(3);

  const updateColumns = () => {
    setNumColumns(getNumColumns(innerWidth));
  };

  useEffect(() => {
    updateColumns();
    setHasInitializedColumns(true);
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const distributePhotos = (photos: Photo[], numColumns: number) => {
    const columns = Array.from({ length: numColumns }, () => []);
    photos.forEach((photo, i) => columns[i % numColumns].push(photo));
    return columns;
  };

  const columns = distributePhotos(photos, numColumns);

  return (
    <>
      <div
        className={`flex gap-2 ${
          hasInitializedColumns ? "opacity-100" : "opacity-0"
        }`}
      >
        {columns.map((column, i) => (
          <div key={i} className="flex flex-1 gap-2 flex-col">
            {column.map((photo: Photo) => (
              <Link
                key={photo.id}
                href={{ pathname: "/photos", query: { id: photo.id } }}
                as={`/photos/${photo.id}`}
                passHref
                shallow
                scroll={false}
              >
                <div
                  key={photo.url}
                  className="group relative flex overflow-hidden"
                  style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                >
                  <Image
                    src={photo.url}
                    alt={photo.description}
                    sizes="512px"
                    className="w-full h-auto bg-gray-200 dark:bg-neutral-900"
                    width={photo.width}
                    height={photo.height}
                    quality={90}
                    loader={(props) =>
                      contentfulLoader({
                        ...props,
                      })
                    }
                  />
                  <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col justify-end gap-1 bg-gradient-to-b from-transparent via-transparent via-50% to-black/60 px-4 pb-5 pt-0 text-white group-hover:opacity-100 opacity-0 transition-opacity">
                    <div className="line-clamp-2 text-base">
                      {photo.description}
                    </div>
                    <div className="text-sm opacity-75">
                      <ExifSummary exif={photo.exif} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Masonry;
