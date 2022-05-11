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
        class="p-button--success authentication__submit-button"
        label="Oturum Aç"
        type="submit"
        icon="pi pi-check-circle"
      />
    </form>
  </section>
</template>

<script setup lang="ts">
import useAuthenticationStore from '@/store/authentication';
import ERoutes from '@/enums/routes';

definePageMeta({
  title: 'VPS Giriş',
});

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
    router.push(ERoutes.DASHBOARD);
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
