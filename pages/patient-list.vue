<template>
  <div
    class="flex flex-col h-min-[200px] patient-list basis-full"
    :class="{ 'pointer-events-none opacity-70': sidenavStore.isLoading }"
  >
    <div class="flex mb-6 patient-list__search-and-actions" v-if="!isSearch">
      <AntInput
        class="h-14 w-full patient-list__search !w-60 !border-none !rounded-xl !py-0 !pl-10 mr-auto"
        :placeholder="t('search')"
        @change="(event) => setDebouncedQuery(event.target.value)"
      >
        <template #suffix>
          <SearchOutlined />
        </template>
      </AntInput>
      <NuxtLink
        class="patient-list__button patient-list__button--add"
        :to="`${ERoutes.PATIENT_FORM}?type=add`"
        v-if="!isRemoving"
      >
        <PlusCircleOutlined class="mr-2" />
        <span class="w-full">{{ t('add') }}</span>
      </NuxtLink>
      <AntButton
        class="patient-list__button patient-list__button--remove"
        :class="{ 'patient-list__button--complete mr-4': isRemoving }"
        :disabled="isRemoving ? !selectedRowKeys?.length : false"
        @click="() => (isRemoving ? completeRemoval() : startRemoval())"
      >
        <DeleteOutlined />
        <span class="w-full">{{ t(isRemoving ? 'complete' : 'remove') }}</span>
      </AntButton>
      <AntButton
        class="patient-list__button patient-list__button--cancel"
        @click="cancelRemoval"
        v-if="isRemoving"
      >
        <CloseCircleOutlined />
        <span class="w-full">{{ t('cancel') }}</span>
      </AntButton>
    </div>
    <div class="patient-list__search mb-6" v-else>
      <AntInput
        class="h-14 w-full patient-list__search !w-60 !border-none !rounded-xl !py-0 !pl-10 mr-auto"
        :placeholder="t('search')"
        :disabled="sidenavStore.isLoading"
        @change="(event) => searchPatients(event.target.value)"
      >
        <template #suffix>
          <SearchOutlined />
        </template>
      </AntInput>
    </div>
    <AntTable
      class="patient-list__patient-table patient-table"
      :data-source="filteredPatients"
      :columns="isSearch ? searchColumns : columns"
      :scroll="{ x: 'calc(150vw)', y: sidenavStore.tableBodyHeight }"
      :pagination="false"
      :row-selection="
        isSelectable
          ? {
              selectedRowKeys,
              onChange: updateSelectedRows,
            }
          : null
      "
      :custom-row="
        (patient) => {
          return {
            onClick: isSelectable
              ? () => handleRowClickForSelect(patient)
              : () => navigateToPatientForm(patient.id),
          };
        }
      "
      bordered
      table-layout="ellipsis"
      row-class-name="patient-table__row"
    >
      <template #headerCell="{ title }">
        <AntTooltip placement="topLeft" :mouse-enter-delay="0.4">
          <template #title>
            <span class="block text-center">
              {{ title }}
            </span>
          </template>
          {{ title }}
        </AntTooltip>
      </template>
    </AntTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  CloseCircleOutlined,
  SearchOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons-vue';
import { debounce } from '@antfu/utils';
import { Key } from 'ant-design-vue/es/_util/type';
import { useToast } from 'vue-toastification';

import usePatientStore from '@/store/patient';
import useSidenavStore from '@/store/sidenav';

import ERoutes from '@/enums/routes';
import IServerResponse from '@/interfaces/server-response';
import IPatient from '@/interfaces/patient';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import handleResponse from '@/utils/handle-response';
import generateColumnProcessorFunction from '@/utils/column-processor';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();

const isSelectable = ref(false);
const isRemoving = ref(false);
const selectedRowKeys = ref<Key[]>([]);
const debouncedQuery = ref('');
const searchText = ref('');
const debouncedSearchText = ref('');

// Props

const props = defineProps<{ hideActions?: boolean; isSearch?: boolean }>();

definePageMeta({
  layout: 'with-sidenav',
  alias: ERoutes.PATIENT_LIST,
});

// Computed

const filteredPatients = computed(() => {
  const query = debouncedQuery.value.toLowerCase();

  return (
    query
      ? patientStore.list.filter(({ name, lastName, tckn }) => {
          return (
            name.toLowerCase().includes(query) ||
            lastName.toLowerCase().includes(query) ||
            tckn.toLowerCase().includes(query)
          );
        })
      : patientStore.list
  )
    .sort((patientA: IPatient, patientB: IPatient) => {
      if (patientA.id > patientB.id) return -1;
      if (patientA.id < patientB.id) return 1;
      return 0;
    })
    .map((patient, index) => {
      return { ...patient, key: index };
    });
});

// Methods

const handleRowClickForSelect = (patient: IPatient) => {
  const { key } = patient;
  if (!selectedRowKeys.value.includes(key)) {
    updateSelectedRows([...selectedRowKeys.value, patient.key]);
  } else {
    updateSelectedRows(
      selectedRowKeys.value.filter((rowKey) => rowKey !== key)
    );
  }
};

const updateSelectedRows = (keys: Key[]) => {
  selectedRowKeys.value = keys;
};

const navigateToPatientForm = (patientId?: number) => {
  router.push({
    path: ERoutes.PATIENT_FORM,
    query: { type: 'update', patientId },
  });
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
      const { id, name, lastName } = filteredPatients.value[key];
      const patientName = `${name} ${lastName}`;
      await handleResponse(
        $fetch<IServerResponse>(`/api/patient/delete?patientId=${id}`, {
          method: 'DELETE',
        }),
        {
          success: () => {
            toast.success(
              t('remove-request.success', {
                patientName,
              })
            );
          },
          error: () => {
            toast.error(
              t('remove-request.error', {
                patientName,
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
  patientStore.fetchPatients();
};

const setDebouncedQuery = debounce(400, false, (value: string) => {
  debouncedQuery.value = value;
});

const searchPatients = debounce(400, false, (searchText: string) => {
  if (searchText) {
    patientStore.searchPatients(searchText);
  } else {
    patientStore.fetchPatients();
  }
});

// Life Cycle Hooks

onMounted(() => {
  setupSidenavStore(
    t(`title.${props.isSearch ? 'search' : 'list'}`),
    ERoutes.PATIENT_LIST
  );
  patientStore.fetchPatients();
});

const columns = [
  {
    dataIndex: 'name',
    title: t('patient.name'),
    fixed: 'left',
  },
  {
    dataIndex: 'lastName',
    title: t('patient.last-name'),
    fixed: 'left',
  },
  { dataIndex: 'tckn', title: t('patient.tckn') },
  { dataIndex: 'birthDate', title: t('patient.birth-date') },
  { dataIndex: 'age', title: t('patient.age') },
  {
    dataIndex: 'gender',
    title: t('patient.gender'),
    customRender: generateColumnProcessorFunction('gender'),
  },
  {
    dataIndex: 'maritalStatus',
    title: t('patient.marital-status'),
    customRender: generateColumnProcessorFunction('marital-status'),
  },
  {
    dataIndex: 'education',
    title: t('patient.education'),
    customRender: generateColumnProcessorFunction('education'),
  },
  {
    dataIndex: 'profession',
    title: t('patient.profession'),
  },
  {
    dataIndex: 'salaryRange',
    title: t('patient.salary-range'),
    customRender: generateColumnProcessorFunction('salary-range'),
  },
  {
    dataIndex: 'medicinesCurrentlyUsed',
    title: t('patient.medicines-currently-used'),
  },
  {
    dataIndex: 'alcoholUsage',
    title: t('patient.alcohol-usage'),
    customRender: generateColumnProcessorFunction('alcohol-usage'),
  },
  {
    dataIndex: 'useDrugs',
    title: t('patient.use-drugs'),
    customRender: generateColumnProcessorFunction('boolean'),
  },
  {
    dataIndex: 'isPsychiatryInChildhood',
    title: t('patient.is-psychiatry-in-childhood'),
    customRender: generateColumnProcessorFunction('boolean'),
  },
  {
    dataIndex: 'psychiatryTime',
    title: t('patient.psychiatry-time'),
  },
  {
    dataIndex: 'isDiagnosisOfHyperactivityInChildhood',
    title: t('patient.is-diagnosis-of-hyperactivity-in-childhood'),
    customRender: generateColumnProcessorFunction('boolean'),
  },
  {
    dataIndex: 'hyperactivityMedicineName',
    title: t('patient.hyperactivity-medicine-name'),
  },
  {
    dataIndex: 'hyperactivityMedicineTime',
    title: t('patient.hyperactivity-medicine-time'),
  },
  {
    dataIndex: 'motherEducation',
    title: t('patient.mother-education'),
    customRender: generateColumnProcessorFunction('education'),
  },
  {
    dataIndex: 'fatherEducation',
    title: t('patient.father-education'),
    customRender: generateColumnProcessorFunction('education'),
  },
  {
    dataIndex: 'parentingAttitude',
    title: t('patient.parenting-attitude'),
    customRender: generateColumnProcessorFunction('parenting-attitude'),
  },
  { dataIndex: 'savedDate', title: t('patient.saved-date') },
].map((column) => ({ ...column, ellipsis: true }));

const searchColumns = [
  { dataIndex: 'tckn', title: t('patient.tckn') },
  {
    dataIndex: 'name',
    title: t('patient.name'),
  },
  {
    dataIndex: 'lastName',
    title: t('patient.last-name'),
  },
  { dataIndex: 'birthDate', title: t('patient.birth-date') },
  {
    dataIndex: 'gender',
    title: t('patient.gender'),
    customRender: generateColumnProcessorFunction('gender'),
  },
  {
    dataIndex: 'education',
    title: t('patient.education'),
    customRender: generateColumnProcessorFunction('education'),
  },
  {
    dataIndex: 'profession',
    title: t('patient.profession'),
  },
  {
    dataIndex: 'alcoholUsage',
    title: t('patient.alcohol-usage'),
    customRender: generateColumnProcessorFunction('alcohol-usage'),
  },
  { dataIndex: 'savedDate', title: t('patient.saved-date') },
].map((column) => ({ ...column, ellipsis: true }));
</script>

<style scoped lang="scss">
.patient-list__button {
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

.patient-table {
  :deep(.patient-table__row) {
    @apply cursor-pointer;
  }
}
</style>

<i18n lang="yaml">
tr:
  title:
    search: Arama
    list: Hasta Kayıtları
  search: Arama
  change: Değiştir
  add: Ekle
  remove: Sil
  complete: Tamamla
  cancel: İptal
  patient-records: Hasta Kayıtları
  remove-request:
    success: '{patientName} başarıyla silindi.'
    error: '{patientName} silinirken bir hata ile karşılaşıldı.'
</i18n>
