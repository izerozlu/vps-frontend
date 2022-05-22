interface IVideo {
  title: string;
  patient: { id: number };
  savedDate: string;
  fileUrl: string;
  key?: number;
}

export default IVideo;
