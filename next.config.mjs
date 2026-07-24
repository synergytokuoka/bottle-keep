// GitHub Actions 上でのビルド時のみ、GitHub Pages のリポジトリ名サブパスを付与する
// (ローカルの `next dev` / `next start` では basePath なしの従来通りの動作にするため)
const repoName = 'bottle-keep'
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isGithubPagesBuild ? `/${repoName}` : '',
  assetPrefix: isGithubPagesBuild ? `/${repoName}/` : '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
