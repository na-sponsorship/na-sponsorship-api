module.exports = {
  baseImageURL: "https://na-sponsorship-api-prod.herokuapp.com/",
  build: {
    destination: {
      path: "build_production",
    },
    layout: "src/emails/src/layouts/default.njk",
    tailwind: {
      config: "src/emails/tailwind.config.js",
      css: "src/emails/src/assets/css/main.css",
    },
    templates: {
      filetypes: "html|njk|nunjucks",
      source: "src/emails/src/templates",
    },
  },
  cleanup: {
    preferBgColorAttribute: true,
    purgeCSS: {
      content: [
        "src/emails/src/layouts/**/*.*",
        "src/emails/src/partials/**/*.*",
        "src/emails/src/components/**/*.*",
      ],
    },
    removeUnusedCSS: {
      enabled: true,
      uglify: true,
    },
  },

  inlineCSS: {
    enabled: true,
  },

  minify: {
    collapseWhitespace: true,
    maxLineLength: 500,
    minifyCSS: true,
    processConditionalComments: true,
  },
};
