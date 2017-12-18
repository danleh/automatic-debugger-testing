curl https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F464640%2Fchrome-linux.zip?alt=media > chromium-59.zip
unzip chromium-59.zip
mv chrome-linux/ chromium-59/
curl https://ftp.mozilla.org/pub/firefox/releases/54.0/linux-x86_64/en-US/firefox-54.0.tar.bz2 > firefox-54.tar.bz2
tar -xvf firefox-54.tar.bz2
mv firefox/ firefox-54/
