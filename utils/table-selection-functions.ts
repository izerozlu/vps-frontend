import { Key } from 'ant-design-vue/es/_util/type';
import { Ref } from 'vue';

import IEntityWithKey from '@/interfaces/entity-with-key';

type KeyArrayRef = Ref<Key[]>;

export const handleRowClickForSelect = (
  entityWithKey: IEntityWithKey,
  selectedRowKeys: KeyArrayRef
) => {
  const { key } = entityWithKey;
  debugger;

  if (!selectedRowKeys.value?.includes(key)) {
    updateSelectedRows(
      [...(selectedRowKeys.value || []), entityWithKey.key],
      selectedRowKeys
    );
  } else {
    updateSelectedRows(
      selectedRowKeys.value?.filter((rowKey) => rowKey !== key),
      selectedRowKeys
    );
  }
};

export const updateSelectedRows = (
  keys: Key[],
  selectedRowKeys: KeyArrayRef
) => {
  debugger;
  selectedRowKeys.value = keys;
};
