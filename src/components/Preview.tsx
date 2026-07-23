import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { SceneData, GridItemData } from '../types';
import { setTagFilter } from '../animations/previewScene';

interface PreviewProps {
  data: SceneData;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Preview: React.FC<PreviewProps> = ({ data, onClose }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [focusedItem, setFocusedItem] = useState<GridItemData | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    data.gridItems.forEach((item) => item.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [data.gridItems]);

  const handleTagClick = useCallback((tag: string) => {
    setTagFilter(tag);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onFocus = (e: Event) => {
      setFocusedItem((e as CustomEvent).detail as GridItemData);
    };
    const onBlur = () => {
      setFocusedItem(null);
    };
    const onTag = (e: Event) => {
      setActiveTag((e as CustomEvent).detail as string | null);
    };

    root.addEventListener('preview:focus', onFocus);
    root.addEventListener('preview:blur', onBlur);
    root.addEventListener('preview:tag', onTag);

    return () => {
      root.removeEventListener('preview:focus', onFocus);
      root.removeEventListener('preview:blur', onBlur);
      root.removeEventListener('preview:tag', onTag);
    };
  }, []);

  return (
    <div className="preview" id={data.id} ref={rootRef}>
      <header className="preview__header">
        <h2 className="preview__title">
          <span>{data.title}</span>
        </h2>
        <button className="preview__close" onClick={onClose}>
          Close ×
        </button>
      </header>
      <div className="preview__stage" />
      <div className={`preview__detail ${focusedItem ? 'preview__detail--active' : ''}`}>
        {focusedItem && (
          <>
            <strong className="preview__detail-caption">{focusedItem.caption}</strong>
            <span className="preview__detail-desc">{focusedItem.description}</span>
          </>
        )}
      </div>
      <div className="preview__filter">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`preview__filter-tag ${activeTag === tag ? 'preview__filter-tag--active' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="visually-hidden">
        {data.gridItems.map((item, i) => (
          <span key={i}>{item.caption}</span>
        ))}
      </div>
    </div>
  );
};

export default Preview;
