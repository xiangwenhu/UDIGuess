import browser from "./browser";

export default function getSize() {
  const rate = browser.isPc ? 0.5 : 1;
  const width = ~~(document.documentElement.clientWidth * 0.95 * rate);
  const height = ~~(document.documentElement.clientWidth * 0.5 * rate);
  return {
    width,
    height
  };
}
