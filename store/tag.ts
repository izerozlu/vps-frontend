import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { i18n } from '@/plugins/vue-i18n';

import useSidenavStore from '@/store/sidenav';
import useVideoStore from '@/store/video';

import IPatient from '@/interfaces/patient';
import handleResponse from '@/utils/handle-response';
import IVideo from '@/interfaces/video';
import ITag from '@/interfaces/tag';

const useTagStore = defineStore('tag', {
  state: () => {
    return {
      tagVideoMap: {} as { [videoId: IVideo['id']]: ITag[] },
      form: {} as ITag,
      selectedPatient: {} as IPatient,
      selectedVideo: {} as IVideo,
    };
  },
  actions: {
    async fetchTagOfVideo(videoId?: IVideo['id']) {
      const sidenavStore = useSidenavStore();
      const videoStore = useVideoStore();
      const toast = useToast();
      const { t } = i18n.global;

      if (!videoId) {
        videoId = videoStore.selectedVideo?.id;
      }

      sidenavStore.isLoading = true;
      await handleResponse($fetch(`/api/tag/list?videoId=${videoId}`), {
        success: (response) => {
          const tagList: ITag[] = response.data.list;
          this.tagVideoMap[videoId] = tagList.map((tag, index) => ({
            ...tag,
            key: index,
          }));
        },
        error: () => {
          toast.error(t('error-messages.tag.fetch'), { timeout: 0 });
        },
      });
      sidenavStore.isLoading = false;
    },
    resetForm() {
      this.form = {};
    },
  },
  getters: {
    selectedVideoTagList(): IVideo[] {
      const videoStore = useVideoStore();
      return this.tagVideoMap[videoStore.selectedVideo?.id] || [];
    },
  },
});

export default useTagStore;
