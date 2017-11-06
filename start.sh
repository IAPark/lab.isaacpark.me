
npm install
tsc

pm2 stop lab
pm2 start dist/start.js --name="lab"
echo Running