<template>
  <section
    class="authentication w-full h-full"
    :class="{ 'opacity-60': isLoading }"
  >
    <ProgressBar
      class="authentication__loader"
      :class="{ 'opacity-0': !isLoading }"
      mode="indeterminate"
      style="height: 0.5em"
    />
    <form
      class="authentication__form flex flex-col justify-center items-center w-full h-full"
      @submit.prevent="login"
    >
      <div
        class="authentication__header header flex justify-center items-center mb-20"
      >
        <LogoSvg class="header__logo mr-4" />
        <h1 class="header__title text-2xl font-bold">
          <span class="text-awesome">medi</span
          ><span class="text-american-purple">qu</span>
        </h1>
      </div>
      <div class="authentication__username authentication__input-field">
        <label class="authentication__label" for="username">
          Kullanıcı Adı
        </label>
        <InputText
          class="authentication__input"
          id="username"
          type="text"
          v-model="username"
        />
      </div>
      <div class="authentication__password authentication__input-field">
        <label class="authentication__label" for="password"> Parola </label>
        <InputText
          class="authentication__input"
          id="password"
          type="password"
          v-model="password"
        />
      </div>
      <Button
        class="authentication__submit-button p-button--success"
        label="Oturum Aç"
        type="submit"
        icon="pi pi-check-circle"
      />
    </form>
  </section>
</template>

<script setup lang="ts">
import LogoSvg from 'assets/icons/logo.svg?component';
import useAuthenticationStore from '@/store/authentication';
import ERoutes from '~~/enums/routes';

const router = useRouter();
const authenticationStore = useAuthenticationStore();

const username = ref('');
const password = ref('');
const isLoading = ref(false);

const login = async () => {
  isLoading.value = true;
  const { data } = await useFetch<{ status: 'success' | 'fail' }>(
    '/api/authentication/login',
    {
      method: 'POST',
      body: { username: username.value, password: password.value },
    }
  );
  isLoading.value = false;

  if (data.value.status === 'success') {
    authenticationStore.login();
    router.push(ERoutes.PATIENT_LIST);
  }
};
</script>

<style lang="scss">
.authentication__input-field {
  @apply mb-6 flex flex-col w-[610px];
}

.authentication__label {
  @apply text-label text-american-purple font-bold mb-3;
}

.authentication__input {
  @apply border border-american-purple border-solid rounded-lg;
}
</style>
