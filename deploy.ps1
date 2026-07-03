# 로컬 빌드 → gh-pages 브랜치 강제 푸시로 배포.
# 계정 Actions 잠금으로 워크플로 배포가 막혀 있는 동안의 배포 경로.
# 잠금 해제 후에는 .github/workflows/deploy.yml을 다시 활성화하고
# Pages 소스를 GitHub Actions로 되돌리면 이 스크립트는 필요 없음.
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }
Push-Location dist
git init -b gh-pages
git add -A
git commit -m "deploy"
git push -f https://github.com/audidas/audidas.github.io.git gh-pages
Pop-Location
Remove-Item -Recurse -Force dist\.git
