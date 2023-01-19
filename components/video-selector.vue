<template>
  <AntSelect
    class='video-selector w-[240px]'
    :placeholder="t('select-video')"
    :value='videoStore.selectedVideo?.id'
    :disabled='disabled'
    @select="(videoId) => emit('video-select', videoId)"
  >
    <AntSelectOption
      :value='video.id'
      v-for='video in videoStore.selectedPatientVideoList'
    >
      {{ video.title }}
    </AntSelectOption>
  </AntSelect>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n';

import useVideoStore from '@/store/video';

const { t } = useI18n();

const videoStore = useVideoStore();

const props = defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ (e: 'video-select', videoId: number): void }>();
</script>

<i18n lang='yaml'>
tr:
  select-video: Video Seçiniz
</i18n>
