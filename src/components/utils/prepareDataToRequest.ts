export function prepareDataToRequest<T extends Record<string, string>>(
  fields: string[],
  formData: FormData,
) {
  const obj = {} as Record<string, string>;

  fields.forEach((field) => {
    obj[field] = String(formData.get(field));
  });

  return obj as T;
}
