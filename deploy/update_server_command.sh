#!/bin/sh
cd /srv/timemanager/T-POO-700-REN-5/deploy
git fetch
diff=`cd /srv/timemanager/T-POO-700-REN-5 && git diff lucas_docker origin/lucas_docker`
status_update=`cat /srv/timemanager/status_update`
if [ ! "$diff" = "" ] && [ ! "$status_update" = "Running"  ]
then
        echo "Running" > /srv/timemanager/status_update
        git reset --hard HEAD
        git pull
        docker-compose -f docker-compose.yml up -d --build
        docker image prune -f
        echo "Stop" > /srv/timemanager/status_update
else
        if [ "$status_update" = "Running" ]
        then
          echo "`date`: Update is already in progress"
        else
          echo "`date`: No update on branch"
        fi
fi
