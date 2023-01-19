<template>
  <button
    class="video-tag rounded-xl mr-2 mb-2 border-2 border-solid p-2 hover:bg-gray-200 active:bg-gray-300"
    :class="{
      'bg-american-purple text-white hover:text-black':
        !tag.tag || !tag.endTime,
    }"
    type="button"
    @click="(event) => emit('activate-tag', event)"
  >
    <span class="video-tag__name mr-2 font-bold" v-if="tag.tag">
      {{ tag.tag }}:
    </span>
    <span class="video-tag__no-name font-bold mr-2" v-else>
      {{ t('new-tag') }}:
    </span>
    <span class="video-tag__start-time mr-1">{{ tag.startTime }}</span>
    <span class="video-tag__end-time" v-if="tag.endTime">
      - {{ tag.endTime }}
    </span>
  </button>
</template>

<script lang="ts" setup>
import ITag from '@/interfaces/tag';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{ tag: ITag }>();

const emit = defineEmits<{ (e: 'activate-tag', event: MouseEvent): void }>();
</script>
