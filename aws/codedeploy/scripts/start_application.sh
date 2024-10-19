#!/bin/bash
echo "Starting application..."
nohup java -jar /opt/zer0/zer0-0.0.1-SNAPSHOT.war --spring.profiles.active=prod > /opt/zer0/app.log 2>&1 &