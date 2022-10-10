<template>
  <AntModal
    class="tag-registration-modal"
    :visible="visible"
    :closable="false"
    :onCancel="() => emit('cancel')"
    :onOk="() => emit('save', tag)"
    :title="t('title')"
  >
    <div class="tag-form__field">
      <label class="mr-16 tag-form__label" for="tag">
        {{ t('tag.tag') }}:
      </label>
      <AntInput id="tag" class="tag-form__input" v-model:value="tag.tag" />
    </div>
    <div class="tag-form__field">
      <label class="mr-16 tag-form__label" for="start-time">
        {{ t('tag.start-time') }}:
      </label>
      <AntTimePicker
        class="tag-form__input"
        id="start-time"
        format="mm:ss"
        value-format="mm:ss"
        :clear-icon="false"
        :show-now="false"
        v-model:value="tag.startTime"
      />
    </div>
    <div class="tag-form__field">
      <label class="mr-16 tag-form__label" for="end-time">
        {{ t('tag.end-time') }}:
      </label>
      <AntTimePicker
        class="tag-form__input"
        id="end-time"
        format="mm:ss"
        value-format="mm:ss"
        :clear-icon="false"
        :show-now="false"
        v-model:value="tag.endTime"
      />
    </div>
  </AntModal>
</template>

<script setup lang="ts">
import IVideo from '~/interfaces/video';
import { useI18n } from 'vue-i18n';
import ITag from '~/interfaces/tag';

const { t } = useI18n();

// Props
const props = defineProps<{ tag: ITag; video: IVideo; visible: boolean }>();

// Emits
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', tag: ITag): void;
}>();
</script>

<style lang="scss">
.ant-btn-primary {
  @apply bg-primary-purple;
}
</style>

<style lang="scss" scoped>
.tag-form__field {
  @apply flex mb-6 w-full min-h-[52px] relative items-center;
}

.tag-form__label {
  @apply w-[160px] truncate flex-shrink-0;
}

.tag-form__input {
  @apply w-full;
  box-shadow: 0 11px 23px 0 #00000005;

  :deep(input) {
    @apply border-none py-4 px-8;
    box-shadow: 0 11px 23px 0 #00000005;
  }
}
</style>

<i18n lang="yaml">
tr:
  title: Yeni Etiket
</i18n>
