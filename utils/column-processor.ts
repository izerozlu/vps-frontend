import { i18n } from '@/plugins/vue-i18n';

const processEnumKey = (key: string | boolean | undefined) => {
  return key?.toString().toLowerCase().replace(/[_]/g, '-');
};

const generateColumnProcessorFunction = (parentKey: string) => {
  const { t } = i18n.global;

  return ({ value }: { value: string | boolean }) => {
    if (typeof value === 'boolean') {
      value = JSON.stringify(value);
    }
    return value ? t(`${parentKey}.${processEnumKey(value)}`) : null;
  };
};

export default generateColumnProcessorFunction;
