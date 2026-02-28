del package.json
npx -y create-next-app@latest beekiss --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
xcopy /E /H /Y beekiss\* .
rmdir /S /Q beekiss
