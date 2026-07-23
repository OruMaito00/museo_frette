export interface GridItemData {
  image: string;
  caption: string;
  description: string;
  tags: string[];
}

export interface SceneData {
  id: string;
  title: string;
  radius?: number;
  cellCount: number;
  images: string[];
  gridItems: GridItemData[];
}
