const isProduction = true;

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(isProduction ? { cssnano: {} } : {}),
  },
};
