export interface Anime {
  id: number;
  title: string;
  episodes: number;
  status: 'Watching' | 'Completed' | 'Plan to Watch';
  imageUrl: string;
  owner?: string;
}