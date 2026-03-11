export function validateIcon(iconMap, configs) {
  const usedIcons = new Set();

  configs.forEach((config) => {
    config.forEach((item) => {
      const key = item.icon || item.iconKey;

      if (!key) return;

      usedIcons.add(key);

      if (!iconMap[key]) {
        console.error(`❌ Icon "${key}" chưa được mapping trong iconMap`);
      }
    });
  });
  Object.keys(iconMap).forEach((key) => {
    if (!usedIcons.has(key)) {
      console.warn(
        `⚠️ Icon "${key}" tồn tại trong iconMap nhưng không được sử dụng`,
      );
    }
  });
}
