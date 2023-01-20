#!/bin/sh

echo "Runing app in the container"
echo "Path to logs: $LOGS_PATH"
echo "INICIO LIMPIO DE LOGS: $LOGS_PATH" > $LOGS_PATH/logger.log
echo "Starting..."

npm start  >> $LOGS_PATH/logger.log 2>&1

tail -f $LOGS_PATH/logger.log
