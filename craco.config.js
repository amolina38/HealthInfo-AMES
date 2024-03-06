const path = require("path");

module.exports = {
  webpack: {
    alias: {
      '@style': path.resolve(__dirname, 'style/')
    }
  }
};