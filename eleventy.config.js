module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js" });
  // Keep control codes like 2-8-1-1 reading left-to-right inside Arabic text
  eleventyConfig.addTransform("ltr-codes", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const i = content.indexOf("<body");
    if (i < 0) return content;
    const re = /(?<![\w\/.-])(\d+(?:-\d+)+)(?![\w-])/g;
    // only touch visible text nodes, never tag attributes (e.g. SVG paths)
    const body = content.slice(i).replace(/>([^<]+)</g, (m, txt) => ">" + txt.replace(re, '<bdi dir="ltr">$1</bdi>') + "<");
    return content.slice(0, i) + body;
  });
  eleventyConfig.addCollection("samples", (api) =>
    api.getFilteredByGlob("src/content/samples/*.md").sort((a, b) => a.data.order - b.data.order)
  );
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
