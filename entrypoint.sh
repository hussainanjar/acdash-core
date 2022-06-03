#!/bin/sh
npx sequelize-cli db:migrate
doppler run -- yarn start >> /app/log/node_start.log 2>&1 &
tail -f /dev/null
