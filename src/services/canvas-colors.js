export const getDataLabelBg = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'rgba(0, 0, 0, 0.4)'
    : 'rgba(255, 255, 255, 0.6)'
}
