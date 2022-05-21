<template>
  <div class="flex flex-col h-min-[200px] patient-list basis-full">
    <div class="flex mb-6 patient-list__search-and-actions">
      <AntInput
        class="h-14 w-full patient-list__search !w-60 !border-none !rounded-xl !py-0 !pl-10 mr-auto"
        :placeholder="t('search')"
        @change="(event) => setDebouncedQuery(event.target.value)"
      >
        <template #suffix>
          <SearchOutlined />
        </template>
      </AntInput>
      <AntButton
        class="patient-list__button patient-list__button--add"
        @click="navigateToPatientForm('add')"
        v-if="!isRemoving"
      >
        <PlusCircleOutlined />
        <span class="w-full">{{ t('add') }}</span>
      </AntButton>
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
    <AntTable
      class="patient-list__patient-table patient-table"
      :data-source="filteredPatients"
      :columns="columns"
      :scroll="{ x: true }"
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
              : () => navigateToPatientForm('update', patient.id),
          };
        }
      "
      bordered
      row-class-name="patient-table__row"
    />
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

definePageMeta({
  title: 'Patient List',
  layout: 'with-sidenav',
  alias: ERoutes.PATIENT_LIST,
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();

const isSelectable = ref(false);
const isRemoving = ref(false);
const selectedRowKeys = ref<Key[]>([]);
const debouncedQuery = ref('');

// Computed

const filteredPatients = computed(() => {
  const query = debouncedQuery.value.toLowerCase();

  return (
    query
      ? patientStore.list.filter(({ name, lastName }) => {
          return (
            name.toLowerCase().includes(query) ||
            lastName.toLowerCase().includes(query)
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

const navigateToPatientForm = (type: 'add' | 'update', patientId?: number) => {
  router.push({ path: ERoutes.PATIENT_FORM, query: { type, patientId } });
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

const updateSelectedRows = (keys: Key[]) => {
  selectedRowKeys.value = keys;
};

const completeRemoval = async () => {
  sidenavStore.isLoading = true;
  await Promise.all(
    selectedRowKeys.value.map(async (key) => {
      const { id, name, lastName } = filteredPatients.value[key];
      const patientName = `${name} ${lastName}`;
      const response = await $fetch<IServerResponse>(
        `/api/patient/delete?patientId=${id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.status === 'fail') {
        toast.error(
          t('remove-request.error', {
            patientName,
          }),
          { timeout: 0 }
        );
      }
      // await handleResponse(
      //   {
      //     success: () => {
      //       toast.success(
      //         t('remove-request.success', {
      //           patientName,
      //         })
      //       );
      //     },
      //     error: () => {
      //       toast.error(
      //         t('remove-request.error', {
      //           patientName,
      //         }),
      //         { timeout: 0 }
      //       );
      //     },
      //   }
      // );
    })
  );

  sidenavStore.isLoading = false;
  cancelRemoval();
  fetchPatients();
};

const processEnumKey = (key: string | boolean | undefined) => {
  return key?.toString().toLowerCase().replace(/[_]/g, '-');
};

const setDebouncedQuery = debounce(400, false, (value: string) => {
  debouncedQuery.value = value;
});

const generateColumnProcessorFunction = (parentKey: string) => {
  return ({ value }: { value: string }) =>
    value ? t(`${parentKey}.${processEnumKey(value)}`) : null;
};

const fetchPatients = async () => {
  sidenavStore.isLoading = true;
  // await handleResponse($fetch('/api/patient/list'), {
  //   success: (response: IServerResponse) =>
  //     (patientStore.list = response.data.list),
  // });
  const response: IServerResponse = await $fetch('/api/patient/list');

  if (response.status === 'success') {
    patientStore.list = response.data.list;
  }

  sidenavStore.isLoading = false;
};

// Life Cycle Hooks

onMounted(() => {
  setupSidenavStore(t('patient-records'), ERoutes.PATIENT_LIST);
  fetchPatients();
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
  {
    dataIndex: 'previousDiagnosis',
    title: t('patient.previous-diagnosis'),
  },
];
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
