module.exports = {
  baseImageURL: "https://na-sponsorship-api-prod.herokuapp.com/",
  build: {
    destination: {
      path: "build_production",
    },
    layout: "emails/src/layouts/default.njk",
    tailwind: {
      config: "emails/tailwind.config.js",
      css: "emails/src/assets/css/main.css",
    },
    templates: {
      filetypes: "html|njk|nunjucks",
      source: "emails/src/templates",
    },
  },
  cleanup: {
    preferBgColorAttribute: true,
    purgeCSS: {
      content: [
        "emails/src/layouts/**/*.*",
        "emails/src/partials/**/*.*",
        "emails/src/components/**/*.*",
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
