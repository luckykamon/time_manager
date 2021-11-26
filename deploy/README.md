## Pour lancer le docker avec tout:
>`docker-compose -f docker-compose.yml up -d --build`

## Pour lancer le docker côté serveur (mysql & api)
>`docker-compose -f docker-compose.yml up -d --build mysql_time_manager api_time_manager`

Vous pourrez alors accéder à http://localhost:4000 pour effectuer vos requêtes api

Copier coller le fichier update_server_command.sh au même niveau que le dossier de git clone

Configurer le crontab:
>crontab -e

Y coller le code du fichier crontab.txt et le configurer avec le chemin mis sur le serveur
