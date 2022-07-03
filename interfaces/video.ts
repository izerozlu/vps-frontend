import ITag from './tag';

interface IVideo {
  id?: number;
  title: string;
  patient: { id: number };
  savedDate: string;
  fileUrl: string;
  key?: number;
  rawFile?: File;
  videoTagList?: ITag[];
}

export default IVideo;
