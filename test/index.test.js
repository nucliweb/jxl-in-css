/**
 * @jest-environment jsdom
 */
const postcss = require("postcss");

const plugin = require("..");

function run(input, output, options) {
  expect(postcss([plugin(options)]).process(input).css).toBe(output);
}

it("adds classes and JPEG-XL link", () => {
  run(
    "@media screen { a, b { color: black; background: url(./image.jpg) } }",
    "@media screen { " +
      "a, b { color: black } " +
      "body.no-jxl a, body.no-jxl b { background: url(./image.jpg) } " +
      "body.jxl a, body.jxl b { background: url(./image.jxl) } " +
      "}"
  );
});

it("should work with jpeg, png", () => {
  run(
    "@media screen { a, b { color: black; background: url(./image.jpeg) } }",
    "@media screen { " +
      "a, b { color: black } " +
      "body.no-jxl a, body.no-jxl b { background: url(./image.jpeg) } " +
      "body.jxl a, body.jxl b { background: url(./image.jxl) } " +
      "}"
  );
});

it("should skip urls with [&?]format=jxl", () => {
  run(
    "@media screen { a, b { color: black; background: url(./image.jpeg?format=jxl) } }",
    "@media screen { a, b { color: black; background: url(./image.jpeg?format=jxl) } }"
  );
});

it("removes empty rule", () => {
  run(
    "a,b { background: url(./image.PNG) }",
    "body.no-jxl a,body.no-jxl b { background: url(./image.PNG) }" +
      "body.jxl a,body.jxl b { background: url(./image.jxl) }"
  );
});

it("does not dublicate html tag", () => {
  run(
    "html[lang=en] .icon { background: url(./image.jpg) }",
    "html[lang=en] body.no-jxl .icon { background: url(./image.jpg) }" +
      "html[lang=en] body.jxl .icon { background: url(./image.jxl) }"
  );
});

describe("options", () => {
  it("should add :global() scope when css modules enabled", () => {
    run(
      "a { background: url(./image.png) }",
      "body:global(.no-jxl) a { background: url(./image.png) }" +
        "body:global(.jxl) a { background: url(./image.jxl) }",
      { modules: true }
    );
  });

  it("should use passed classNames", () => {
    run(
      ".c { background: url(./image.png) }",
      "body.no-jxl .c { background: url(./image.png) }" +
        "body.has-jxl .c { background: url(./image.jxl) }",
      { noJxlfClass: "no-jxl", jxlClass: "has-jxl" }
    );
  });

  it("set rename function", () => {
    run(
      ".c { background: url(./image.png) }",
      "body.no-jxl .c { background: url(./image.png) }" +
        "body.jxl .c { background: url(./image.png.jxl) }",
      {
        rename: (oldName) => {
          return oldName.replace(/\.(jpe?g|png|webp)/gi, ".$1.jxl");
        },
      }
    );
  });
});
