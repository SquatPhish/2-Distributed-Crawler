# install chrome debian
sudo apt-get update
sudo apt-get install google-chrome-stable

# for the centos, try yum install

### get your chrome version
apt list --installed | grep chrome


uname -a
# Linux XXXX 3.13.0-132-generic #181-Ubuntu SMP Wed Sep 13 13:25:03 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux


google-chrome --version
# Google Chrome 62.0.3202.89


npm -v
#5.6.0

node -v
# v8.5.0

echo "install puppeteer for Chrome headless"

npm install puppeteer