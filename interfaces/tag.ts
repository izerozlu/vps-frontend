import IVideo from '@/interfaces/video';

interface ITag {
  id?: number;
  tag: string;
  startTime: string;
  endTime: string;
  video?: { id: IVideo['id'] };
  user?: { id: number; username: string };
  checkedForRegistration?: boolean;
}

export default ITag;
