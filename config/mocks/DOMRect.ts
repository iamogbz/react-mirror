export default class DOMRect {
  bottom = 0;
  left = 0;
  right = 0;
  top = 0;
  constructor(
    public x = 0,

    public y = 0,

    public width = 0,

    public height = 0,
  ) {
    this.left = x;
    this.top = y;
    this.right = x + width;
    this.bottom = y + height;
  }
}

Object.assign(window, { DOMRect });
