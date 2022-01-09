export function createMyStyleTag(): HTMLStyleElement {
  const tag = document.createElement("style");
  tag.setAttribute("id", "led-style");
  return tag;
}
