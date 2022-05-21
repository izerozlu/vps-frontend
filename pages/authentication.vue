<template>
  <section
    class="h-full w-full authentication"
    :class="{ 'opacity-60': isLoading }"
  >
    <ProgressBar
      class="authentication__loader"
      :class="{ 'opacity-0': !isLoading }"
      mode="indeterminate"
      style="height: 0.5em"
    />
    <form
      class="flex flex-col h-full w-full authentication__form justify-center items-center"
      @submit.prevent="login"
    >
      <BrandName />
      <div class="authentication__username authentication__input-field">
        <label class="authentication__label" for="username">
          {{ t('username') }}
        </label>
        <AntInput
          class="authentication__input"
          id="username"
          type="text"
          v-model:value="username"
        />
      </div>
      <div class="authentication__password authentication__input-field">
        <label class="authentication__label" for="password">
          {{ t('password') }}
        </label>
        <AntInput
          class="authentication__input"
          id="password"
          type="password"
          v-model:value="password"
        />
      </div>
      <AntButton
        class="authentication__submit-button ant-btn--success"
        html-type="submit"
        :loading="isLoading"
      >
        <template #suffix> <CheckCircleOutlined /> </template>
        {{ t('login') }}
      </AntButton>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

import useAuthenticationStore from '@/store/authentication';
import ERoutes from '@/enums/routes';

definePageMeta({
  title: 'VPS Giriş',
  alias: ERoutes.AUTHENTICATION,
});

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const authenticationStore = useAuthenticationStore();

const username = ref('');
const password = ref('');
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  await authenticationStore.login(username.value, password.value);
  isLoading.value = false;

  if (authenticationStore.isLoggedIn) {
    router.push(ERoutes.ADMIN_BOARD);
  } else {
    toast.error(t('login-error'), { timeout: 0 });
  }
};
</script>

<style lang="scss">
.authentication__input-field {
  @apply flex flex-col mb-6 w-[610px];
}

.authentication__label {
  @apply font-bold text-label text-american-purple mb-3;
}

.authentication__input {
  @apply border border-american-purple border-solid rounded-lg;
}
</style>

<i18n lang="yaml">
tr:
  username: Kullanıcı Adı
  password: Parola
  login-error: Kullanıcı Adı veya Parola hatalı
  login: Oturum Aç
</i18n>
