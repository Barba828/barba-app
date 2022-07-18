const path = require("path");

/**
 * react-app-rewired override config
 * 配置别名
 */
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "src/lib"),
    },
  };

  return config;
};
