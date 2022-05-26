<template>
  <div
    class="flex flex-col h-min-[200px] video-list basis-full"
    :class="{ 'pointer-events-none opacity-70': sidenavStore.isLoading }"
  >
    <div class="flex mb-6 video-list__search-and-actions items-center h-16">
      <AntTooltip
        :visible="!patientStore.selectedPatient?.id"
        placement="right"
      >
        <template #title>
          <span class="block text-center">
            {{ t('cannot-list-without-patient') }}
          </span>
        </template>
        <PatientSelector @patient-select="videoStore.setSelectedPatient" />
      </AntTooltip>
      <NuxtLink
        class="video-list__button video-list__button--add ml-auto"
        :to="ERoutes.VIDEO_FORM"
        v-if="!isRemoving"
      >
        <PlusCircleOutlined class="mr-2" />
        <span class="w-full">{{ t('add') }}</span>
      </NuxtLink>
      <AntButton
        class="video-list__button video-list__button--remove"
        :class="{ 'video-list__button--complete mr-4 ml-auto': isRemoving }"
        :disabled="isRemoving ? !selectedRowKeys?.length : false"
        @click="() => (isRemoving ? completeRemoval() : startRemoval())"
      >
        <DeleteOutlined />
        <span class="w-full">{{ t(isRemoving ? 'complete' : 'remove') }}</span>
      </AntButton>
      <AntButton
        class="video-list__button video-list__button--cancel"
        @click="cancelRemoval"
        v-if="isRemoving"
      >
        <CloseCircleOutlined />
        <span class="w-full">{{ t('cancel') }}</span>
      </AntButton>
    </div>
    <AntTable
      class="video-list__table"
      :class="{ 'table--selectable': isSelectable }"
      :data-source="videoStore.selectedPatientVideoList"
      :columns="columns"
      :scroll="{ x: true, y: sidenavStore.tableBodyHeight }"
      :pagination="false"
      :row-selection="
        isSelectable
          ? {
              selectedRowKeys,
              onChange: (keys) => updateSelectedRows(keys),
            }
          : null
      "
      :custom-row="
        (video) => {
          return {
            onClick: isSelectable
              ? () => handleRowClickForSelect(video)
              : () => handleRowClickForVideoView(video),
          };
        }
      "
      bordered
      row-class-name="table__row"
    >
      <template #bodyCell="{ text, column }">
        <button type="button" v-if="column.dataIndex === 'title'">
          <FolderOpenOutlined />
          {{ text }}
        </button>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </AntTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons-vue';
import { Key } from 'ant-design-vue/es/_util/type';
import { useToast } from 'vue-toastification';
import { FolderOpenOutlined } from '@ant-design/icons-vue';

import usePatientStore from '@/store/patient';
import useSidenavStore from '@/store/sidenav';
import useVideoStore from '@/store/video';

import PatientSelector from '@/components/patient-selector.vue';
import ERoutes from '@/enums/routes';
import IServerResponse from '@/interfaces/server-response';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import handleResponse from '@/utils/handle-response';
import IVideo from '@/interfaces/video';

definePageMeta({
  title: 'Videos',
  layout: 'with-sidenav',
  alias: ERoutes.VIDEO_LIST,
});

const { t } = useI18n();
const toast = useToast();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();
const videoStore = useVideoStore();

const isSelectable = ref(false);
const isRemoving = ref(false);
const selectedRowKeys = ref<Key[]>([]);

const handleRowClickForSelect = (video: IVideo) => {
  const { key } = video;
  if (!selectedRowKeys.value.includes(key)) {
    updateSelectedRows([...selectedRowKeys.value, video.key]);
  } else {
    updateSelectedRows(
      selectedRowKeys.value.filter((rowKey) => rowKey !== key)
    );
  }
};

const updateSelectedRows = (keys: Key[]) => {
  selectedRowKeys.value = keys;
};

const handleRowClickForVideoView = (video: IVideo) => {
  window.open(video.fileUrl, '_blank');
};

const startRemoval = () => {
  isRemoving.value = true;
  isSelectable.value = true;
};

const cancelRemoval = () => {
  isRemoving.value = false;
  isSelectable.value = false;
  selectedRowKeys.value = [];
};

const completeRemoval = async () => {
  sidenavStore.isLoading = true;
  await Promise.all(
    selectedRowKeys.value.map(async (key) => {
      const { id, title: videoName } = videoStore.selectedPatientVideoList[key];
      await handleResponse(
        $fetch<IServerResponse>(`/api/video/delete?videoId=${id}`, {
          method: 'DELETE',
        }),
        {
          success: () => {
            toast.success(
              t('remove-request.success', {
                videoName,
              })
            );
          },
          error: () => {
            toast.error(
              t('remove-request.error', {
                videoName,
              }),
              { timeout: 0 }
            );
          },
        }
      );
    })
  );

  sidenavStore.isLoading = false;
  cancelRemoval();
  videoStore.fetchVideoOfPatient();
};

// Life Cycle Hooks

onMounted(() => {
  patientStore.fetchPatients();
  setupSidenavStore(t('video-list'), ERoutes.VIDEO_LIST);
  if (patientStore.selectedPatient?.id) {
    videoStore.fetchVideoOfPatient();
  }
});

const columns = [
  {
    dataIndex: 'title',
    title: t('video.title'),
    fixed: 'left',
  },
  {
    dataIndex: 'creationDate',
    title: t('video.creation-date'),
  },
  {
    dataIndex: 'savedDate',
    title: t('video.saved-date'),
  },
];
</script>

<style scoped lang="scss">
.video-list__button {
  @apply rounded-xl flex font-semibold text-lg py-4 px-6 items-center;

  &--add {
    @apply bg-primary-purple text-white mr-4;
  }

  &--complete:not([disabled]) {
    @apply bg-primary-purple text-white;
  }

  :deep(.anticon) {
    @apply text-[20px] !important;
  }
}

.table {
  :deep(.table__row) {
    @apply cursor-pointer;
  }
}
</style>

<i18n lang="yaml">
tr:
  video-list: Videolar
  search: Arama
  change: Değiştir
  add: Ekle
  remove: Sil
  complete: Tamamla
  cancel: İptal
  cannot-list-without-patient: Videoları listelemek için Hasta seçmelisiniz.
  remove-request:
    success: '{videoName} başarıyla silindi.'
    error: '{videoName} silinirken bir hata ile karşılaşıldı.'
</i18n>
