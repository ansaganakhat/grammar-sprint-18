/** @type {import('next').NextConfig} */
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserPagesRepository = repositoryName.endsWith(".github.io");
const basePath = process.env.GITHUB_ACTIONS === "true" && !isUserPagesRepository ? `/${repositoryName}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath }
};

export default nextConfig;
