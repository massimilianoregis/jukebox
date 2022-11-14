#!/bin/sh
bluetoothctl connect 35:28:43:78:94:9B
mocp -S
cd ~/jukebox
nohup node index &
xset -dpms     # disable DPMS (Energy Star) features.
xset s off     # disable screen saver
xset s noblank # don't blank the video device
matchbox-window-manager -use_titlebar no &
unclutter &    # hide X mouse cursor unless mouse activated
chromium-browser http://localhost:3002 --no-proxy-server --display=:0 --kiosk --incognito --window-position=0,0 ht