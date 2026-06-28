export type Option = {
  label: string;
  value: string;
};

export function mapToOptions<T extends Record<string, any>>(
  items: T[],
  labelKey: keyof T,
  valueKey: keyof T,
): Option[] {
  return items.map((item) => ({
    label: String(item[labelKey] ?? ""),
    value: String(item[valueKey] ?? ""),
  }));
}
