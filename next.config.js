module.exports = {
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': {page: "/"},
      '/404': {page: "/404"}
    }
  },
  images: {
    loader: "custom"
  }
};
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
