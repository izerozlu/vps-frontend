<template>
  <div class="admin-board">
    <div class="dashbaord__card--authorization admin-board__card">
      <h2 class="admin-board__title">
        {{ t('authentication-and-authorization') }}
      </h2>
      <div class="admin-board__actions actions">
        <button class="admin-board__action group" type="button">
          {{ t('groups') }}
          <RightArrowSvg class="action__arrow" />
        </button>
        <button class="admin-board__action group" type="button">
          {{ t('users') }}
          <RightArrowSvg class="action__arrow" />
        </button>
      </div>
    </div>
    <div class="admin-board__card admin-board-card__vps">
      <h2 class="admin-board__title">{{ t('vps') }}</h2>
      <div class="admin-board__actions admin-board__actions--compact">
        <NuxtLink class="admin-board__action group" :to="ERoutes.PATIENT_LIST">
          {{ t('patient-records') }}
          <RightArrowSvg class="action__arrow" />
        </NuxtLink>
        <button class="admin-board__action group" type="button">
          {{ t('patient-diagnoses') }}
          <RightArrowSvg class="action__arrow" />
        </button>
        <button class="admin-board__action group" type="button">
          {{ t('patient-videos') }}
          <RightArrowSvg class="action__arrow" />
        </button>
        <button class="admin-board__action group" type="button">
          {{ t('video-tags') }}
          <RightArrowSvg class="action__arrow" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import RightArrowSvg from '@/assets/icons/right-arrow.svg?component';
import ERoutes from '@/enums/routes';
import setupSidenavStore from '@/utils/setup-sidenav-store';

const { t } = useI18n();

definePageMeta({
  title: 'VPS Dashboard',
  alias: [ERoutes.ADMIN_BOARD, ERoutes.INDEX],
  middleware: ['redirect-to-admin-board'],
  layout: 'with-sidenav',
});

onMounted(() => setupSidenavStore());
</script>

<style scoped lang="scss">
.admin-board__card {
  @apply rounded-[20px] w-min p-10;
  box-shadow: 0px 7px 13px 0px rgba(43, 193, 85, 0.08);
}

.admin-board__title {
  @apply font-semibold text-lg mb-6;
}

.admin-board__actions {
  @apply flex flex-col w-[620px];

  &--compact {
    .admin-board__action {
      @apply mb-2;
    }
  }
}

.admin-board__action {
  @apply rounded-lg flex bg-light-500 text-left mb-6 p-6 overflow-hidden relative items-center hover:bg-white last:mb-0;
  box-shadow: 0px 10px 49px 0px rgba(0, 0, 0, 0.13);
}

.action__arrow {
  @apply h-3 opacity-0 transition-all right-[-3rem] w-6 absolute group-hover:opacity-100 group-hover:right-6;
}
</style>

<i18n lang="yaml">
tr:
  authentication-and-authorization: Kimlik Doğrulama ve Yetkilendirme
  groups: Gruplar
  users: Kullanıcılar
  vps: VPS
  patient-records: Hasta Kayıtları
  patient-diagnoses: Hasta Tanıları
  patient-videos: Hasta Videoları
  video-tags: Video Etiketleri
</i18n>
