#! /bin/bash

ROOT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd)"
USER="pi"

mkdir -p $ROOT_DIR/logs
rm -f $ROOT_DIR/logs/*

rm -f "${ROOT_DIR}/modbus_sniffer.service"

cat <<EOT >> "${ROOT_DIR}/modbus_sniffer.service"
[Unit]
Description=modbus-sniffer
Documentation=https://sniffer.com

[Service]
Type=simple
User=$USER
Environment=PATH=$PATH:/home/$USER/.config/nvm/versions/node/v14.17.5/bin/
WorkingDirectory=${ROOT_DIR}
ExecStart=/home/$USER/.config/nvm/versions/node/v14.17.5/bin/node ${ROOT_DIR}/node_modules/.bin/ts-node ${ROOT_DIR}/scripts/createMonitor.ts
StandardOutput=file:${ROOT_DIR}/logs/output.log
StandardError=file:${ROOT_DIR}/logs/error.log
Restart=always

[Install]
WantedBy=multi-user.target
EOT

sudo rm -f /lib/systemd/system/modbus_sniffer.service
sudo ln -s "${ROOT_DIR}/modbus_sniffer.service" /lib/systemd/system/modbus_sniffer.service

sudo systemctl daemon-reload
sudo systemctl start modbus_sniffer