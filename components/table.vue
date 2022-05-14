<template>
  <DataTable
    class="table"
    :class="{ 'p-datatable-sm': isCompact }"
    :value="data"
    :scrollable="true"
    scrollHeight="flex"
    striped-rows
    responsiveLayout="scroll"
  >
    <Column
      :class="
        column.isCompact ? 'min-w-[180px] max-w-[180px]' : 'min-w-[240px]'
      "
      :frozen="frozenColumns?.includes(column.field)"
      :field="column.field"
      title="column.header"
      v-for="column in columns"
    >
      <template #header>
        <span :title="column.header">{{ column.header }}</span>
      </template>
      <template #body="slotProps">
        <span
          :class="{ 'font-bold': frozenColumns?.includes(column.field) }"
          :title="slotProps.data[column.field]"
        >
          {{
            column.processor?.(slotProps.data[column.field]) ||
            slotProps.data[column.field]
          }}
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  columns: {
    field: string;
    header: string;
    isCompact?: boolean;
    processor?: (value) => string;
  }[];
  data: any[];
  isCompact?: boolean;
  frozenColumns?: string[];
}>();
</script>

<style scoped lang="scss">
.table {
  :deep(.p-column-header-content) {
    @apply truncate block;
  }

  :deep(.p-datatable-thead th) {
    @apply bg-awesome font-semibold text-white text-xl;

    &:first-of-type {
      @apply rounded-l-xl pl-4;
    }

    &:last-of-type {
      @apply rounded-r-xl pr-4;
    }
  }

  :deep([role='row'] td) {
    @apply text-base truncate block;

    &:first-child {
      @apply pl-4;
    }
    &:last-child {
      @apply pr-4;
    }
  }
}
</style>
