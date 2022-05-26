interface IVideo {
  title: string;
  patient: { id: number };
  savedDate: string;
  fileUrl: string;
  key?: number;
  rawFile?: File;
}

export default IVideo;
