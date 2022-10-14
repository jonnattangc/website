#!/bin/sh

echo "Runing app in the container"
echo "Path to logs: $LOGS_PATH"
echo "Path to logs: $LOGS_PATH" > $LOGS_PATH/logger.log
echo "Starting..."
npm start
