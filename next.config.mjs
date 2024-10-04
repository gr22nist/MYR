const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://cdn.jsdelivr.net https://t1.daumcdn.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://t1.daumcdn.net;
  font-src 'self';
  connect-src 'self' https://va.vercel-scripts.com https://t1.daumcdn.net;
  worker-src 'self' blob:;
  frame-src 'self' https://t1.daumcdn.net http://postcode.map.daum.net;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // 모든 경로에 대해 헤더 적용
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
