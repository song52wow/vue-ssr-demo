const { readFileSync } = require("fs");
const { resolve } = require("path");
const Koa = require("koa");
const { createBundleRenderer } = require("vue-server-renderer");

const app = new Koa();
// const createApp = require("./main");
const serverBundle = require("./dist/vue-ssr-server-bundle.json");

// const renderer =

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false
  // template: readFileSync(resolve("./index.template.html"), "utf-8")
  // clientManifest: clientManifest
});

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}

app.use(async ctx => {
  const context = {
    title: "ssr test",
    url: ctx.url
  };

  try {
    const html = await renderToString(context);

    ctx.body = html;
  } catch (error) {
    console.log("123123");
    if (error.code === 404) {
      ctx.status = 404;
      ctx.body = "Page not found";
    } else {
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
  }
});

app.listen(8000, () => console.log("Server listen at 8000"));
