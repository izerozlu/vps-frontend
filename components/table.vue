<template>
  <DataTable :value="data" striped-rows responsiveLayout="scroll">
    <Column
      :field="column.field"
      :header="column.header"
      v-for="column in columns"
    />
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  columns: { field: string; header: string }[];
  data: any[];
}>();
</script>
