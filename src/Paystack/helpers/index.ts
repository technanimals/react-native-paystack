export {
  getScript,
  PaystackProps,
  ResponseEvent,
  ResponseEventType,
  Currency,
  PaymentChannel,
} from './script';

const isArray = (value: any) => Array.isArray(value);
const isObject = (value: any) => value !== null && typeof value === 'object';
/**
 *
 * @param record
 */
export function stringify(record: Record<string, any>): string {
  const keys = Object.keys(record);
  const data = keys.reduce((memo, key) => {
    let value = record[key];
    if (isArray(value)) {
      value = JSON.stringify(value);
    } else if (isObject(value)) {
      value = stringify(value);
    }
    return {
      ...memo,
      [key]: value,
    };
  }, {});

  return JSON.stringify(data);
}
