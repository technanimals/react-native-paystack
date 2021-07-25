function isObject(value: any) {
  return value !== null && typeof value === 'object';
}
export function stringify(data: Record<string, any>): string {
  const keys = Object.keys(data);

  const response = keys.reduce((memo, key) => {
    const value = data[key];

    if (!value || typeof value === 'function') {
      return memo;
    }

    const stringValue = isObject(value) ? JSON.stringify(value) : `"${value}"`;

    console.log({
      stringValue,
    });
    return memo + `${key}: ${stringValue},`;
  }, '');
  console.log({ response });

  return response;
}
