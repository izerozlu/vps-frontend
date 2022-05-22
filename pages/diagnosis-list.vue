<template>
  <div
    class="flex flex-col h-min-[200px] diagnosis-list basis-full"
    :class="{ 'pointer-events-none opacity-70': sidenavStore.isLoading }"
  >
    <div class="flex mb-6 diagnosis-list__search-and-actions items-center">
      <PatientSelector />
      <AntButton
        class="diagnosis-list__button diagnosis-list__button--add ml-auto"
        v-if="!isRemoving"
        @click="navigateToDiagnosisForm()"
      >
        <PlusCircleOutlined />
        <span class="w-full">{{ t('add') }}</span>
      </AntButton>
      <AntButton
        class="diagnosis-list__button diagnosis-list__button--remove"
        :class="{ 'diagnosis-list__button--complete mr-4 ml-auto': isRemoving }"
        :disabled="isRemoving ? !selectedRowKeys?.length : false"
        @click="() => (isRemoving ? completeRemoval() : startRemoval())"
      >
        <DeleteOutlined />
        <span class="w-full">{{ t(isRemoving ? 'complete' : 'remove') }}</span>
      </AntButton>
      <AntButton
        class="diagnosis-list__button diagnosis-list__button--cancel"
        @click="cancelRemoval"
        v-if="isRemoving"
      >
        <CloseCircleOutlined />
        <span class="w-full">{{ t('cancel') }}</span>
      </AntButton>
    </div>
    <AntTable
      class="diagnosis-list__table table"
      :class="{ 'table--selectable': isSelectable }"
      :data-source="diagnosisList"
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
        (diagnosis) => {
          return {
            onClick: isSelectable
              ? () => handleRowClickForSelect(diagnosis)
              : null,
          };
        }
      "
      bordered
      row-class-name="table__row"
    />
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

import usePatientStore from '@/store/patient';
import useSidenavStore from '@/store/sidenav';
import useDiagnosisStore from '@/store/diagnosis';

import PatientSelector from '~~/components/patient-selector.vue';
import ERoutes from '@/enums/routes';
import IServerResponse from '@/interfaces/server-response';
import setupSidenavStore from '@/utils/setup-sidenav-store';
import handleResponse from '@/utils/handle-response';
import IDiagnosis from '@/interfaces/diagnosis';
import generateColumnProcessorFunction from '@/utils/column-processor';

definePageMeta({
  title: 'Patient Diagnosis',
  layout: 'with-sidenav',
  alias: ERoutes.DIAGNOSIS_LIST,
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const patientStore = usePatientStore();
const sidenavStore = useSidenavStore();
const diagnosisStore = useDiagnosisStore();

const isSelectable = ref(false);
const isRemoving = ref(false);
const selectedRowKeys = ref<Key[]>([]);

// Computed

const diagnosisList = computed<IDiagnosis[]>(() => {
  return (
    diagnosisStore.diagnosisPatientMap[diagnosisStore.selectedPatient?.id] || []
  );
});

// Methods

const navigateToDiagnosisForm = () => {
  router.push({
    path: ERoutes.DIAGNOSIS_FORM,
  });
};

const handleRowClickForSelect = (diagnosis: IDiagnosis) => {
  const { key } = diagnosis;
  if (!selectedRowKeys.value.includes(key)) {
    updateSelectedRows([...selectedRowKeys.value, diagnosis.key]);
  } else {
    updateSelectedRows(
      selectedRowKeys.value.filter((rowKey) => rowKey !== key)
    );
  }
};

const updateSelectedRows = (keys: Key[]) => {
  selectedRowKeys.value = keys;
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
      const { id, name: diagnosisName } = diagnosisList.value[key];
      await handleResponse(
        $fetch<IServerResponse>(`/api/diagnosis/delete?diagnosisId=${id}`, {
          method: 'DELETE',
        }),
        {
          success: () => {
            toast.success(
              t('remove-request.success', {
                diagnosisName,
              })
            );
          },
          error: () => {
            toast.error(
              t('remove-request.error', {
                diagnosisName,
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
  diagnosisStore.fetchDiagnosisOfPatient(diagnosisStore.selectedPatient?.id);
};

// Life Cycle Hooks

onMounted(() => {
  patientStore.fetchPatients();
  setupSidenavStore(t('diagnosis-list'), ERoutes.DIAGNOSIS_LIST);
});

const columns = [
  {
    dataIndex: 'name',
    title: t('diagnosis.name'),
    fixed: 'left',
  },
  {
    dataIndex: 'isMedication',
    title: t('diagnosis.is-medication'),
    customRender: generateColumnProcessorFunction('boolean'),
  },
  { dataIndex: 'medicineName', title: t('diagnosis.medicine-name') },
  { dataIndex: 'medicineTime', title: t('diagnosis.medicine-time') },
  { dataIndex: 'diagnosisDate', title: t('diagnosis.diagnosis-date') },
];
</script>

<style scoped lang="scss">
.diagnosis-list__button {
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

.table--selectable {
  :deep(.table__row) {
    @apply cursor-pointer;
  }
}
</style>

<i18n lang="yaml">
tr:
  diagnosis-list: Hasta Tanıları
  search: Arama
  change: Değiştir
  add: Ekle
  remove: Sil
  complete: Tamamla
  cancel: İptal
  remove-request:
    success: '{diagnosisName} başarıyla silindi.'
    error: '{diagnosisName} silinirken bir hata ile karşılaşıldı.'
</i18n>
