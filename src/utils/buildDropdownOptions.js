import { DROPDOWN_MAP } from "./Constants";

export const buildDropdownOptions = (key, actionHandlers = {}) => {
  const rawOptions = DROPDOWN_MAP[key] ?? [];
  return rawOptions.map((item) => ({
    ...item,
    onClick: actionHandlers[item.action] ?? (() => console.log(item.action)),
  }));
};
