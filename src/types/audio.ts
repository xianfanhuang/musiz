export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'url';
  file?: File;
}