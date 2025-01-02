import config from "./config";

export const preventExtremeLabels = (e) => {
  const minLabel = 0;
  const maxLabel = config.MAX_LABEL_WIDTH_INCHES;
  if (e.target.value < minLabel) {
    e.target.value = minLabel;
  }
  if (e.target.value > maxLabel) {
    e.target.value = maxLabel;
  }
};
