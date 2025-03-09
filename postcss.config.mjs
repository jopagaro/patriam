import tailwindcss from '@tailwindcss/postcss';

const config = {
  plugins: [
    tailwindcss,
    require('autoprefixer')
  ]
};

export default config;
