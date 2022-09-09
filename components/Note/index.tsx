import { MDXRemote } from "next-mdx-remote";
import { DATE_FORMAT } from "../../constants";

const DEFAULT_WIDTH = 430;
const DEFAULT_QUALITY = 75;

const components = {
  img: ({ src, alt }) => {
    return (
      <picture>
        <source
          type="image/avif"
          srcSet={`
            https:${src}?q=${DEFAULT_QUALITY}&w=500&fm=avif 500w,
            https:${src}?q=${DEFAULT_QUALITY}&w=900&fm=avif 900w,
            https:${src}?q=${DEFAULT_QUALITY}&w=1300&fm=avif 1300w`}
          sizes={`(max-width: ${DEFAULT_WIDTH}px) 100vw, ${DEFAULT_WIDTH}px`}
        />
        <source
          type="image/webp"
          srcSet={`
            https:${src}?q=${DEFAULT_QUALITY}&w=500&fm=webp 500w,
            https:${src}?q=${DEFAULT_QUALITY}&w=900&fm=webp 900w,
            https:${src}?q=${DEFAULT_QUALITY}&w=1300&fm=webp 1300w`}
          sizes={`(max-width: ${DEFAULT_WIDTH}px) 100vw, ${DEFAULT_WIDTH}px`}
        />
        <img
          srcSet={`
            https:${src}?q=${DEFAULT_QUALITY}&w=500 500w,
            https:${src}?q=${DEFAULT_QUALITY}&w=900 900w,
            https:${src}?q=${DEFAULT_QUALITY}&w=1300 1300w`}
          sizes={`(max-width: ${DEFAULT_WIDTH}px) 100vw, ${DEFAULT_WIDTH}px`}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </picture>
    );
  },
};

export default function Note({ note }) {
  return (
    <div id={note.sys.id} className="note mb-4">
      <div className="prose prose-invert prose-img:rounded-md prose-p:text-base-adjusted-sm prose-img:m-0">
        <MDXRemote {...note.serializedBody} components={components} />
      </div>
      <a href={`#${note.sys.id}`}>
        <time className="time" dateTime={note.date}>
          {new Date(note.date).toLocaleDateString("en-US", DATE_FORMAT)}
        </time>
      </a>
    </div>
  );
}
