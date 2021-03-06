/**
 * @jest-environment jsdom
 */
const { delay } = require("nanodelay");

class Image {
  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;
    delay(1).then(() => {
      this.height = 1;
      this.onload();
    });
  }
}
global.Image = Image;

require("../polyfill");

it("adds class to body", async () => {
  await delay(100);
  expect(document.body.className).toEqual("jxl");
});
