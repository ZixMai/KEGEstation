# KEGEstation — Production Compose

Этот проект поднимается через Docker Compose с использованием `.env` файла и профиля `prod`.

## Требования

- Docker с включенным Docker Compose v2.

## Запуск

Из директории `Deployments` выполните:

```bash
cd Deployments
docker compose --env-file ../example.env up -d
```

Или prod профиль:

```bash
cd Deployments
docker compose --env-file ../example.env --profile prod up -d
```