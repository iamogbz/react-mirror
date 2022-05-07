export default class DOMRect {
  bottom = 0;
  left = 0;
  right = 0;
  top = 0;
  constructor(
    // eslint-disable-next-line no-unused-vars
    public x = 0,
    // eslint-disable-next-line no-unused-vars
    public y = 0,
    // eslint-disable-next-line no-unused-vars
    public width = 0,
    // eslint-disable-next-line no-unused-vars
    public height = 0,
  ) {
    this.left = x;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
  }
}

Object.assign(window, { DOMRect });
