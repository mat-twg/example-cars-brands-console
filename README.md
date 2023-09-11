## Example Cars-Brand-Console (commander)

[![workflow](https://github.com/mat-twg/example-cars-brands-console/actions/workflows/master.yaml/badge.svg)](https://github.com/mat-twg/example-cars-brands-console/actions/workflows/master.yaml?result=latest)

>Клиентское приложение:
>
>1. Node.JS
>2. TypeScript
>3. Интерпретатор командной строки. В параметрах обязательно должны быть действие и аргументы этого действия в любом
    формате.
>4. При запуске из командной строки с параметрами нужно выполнять подключение к Серверу и выполнять REST API операции.
>5. Данные, полученные от Сервера выводить в консоль.

### [Репозиторий бекенда](https://github.com/mat-twg/example-cars-brands)

### Build

```shell
# Build
yarn build
```

### Usage 

```shell
# Help
node dist/main help
```

```shell
# Get Brands list
node dist/main brands
```

```shell
# Sorting and pagination
node dist/main brands --sort [+name,id] --page 1 --limit 2
```

```shell
# Get Brand by Id
node dist/main brands --id 64f4f14b3b631dd134642c5e
```

```shell
# Create Brand
node dist/main brands create --body '{"name":"test brand"}'
```

```shell
# Update Brand
node dist/main brands update --id 64f4f14b3b631dd134642c5e --body '{"name":"updated"}'
```

```shell
# Delete Brand
node dist/main brands delete --id 64f4f14b3b631dd134642c5e
```
