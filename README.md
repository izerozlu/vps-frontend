# vps-frontend

Frontend application for the **VPS** application.

## Setup

> You will need NodeJS >v14.19.1 to run the application

Install dependencies

```bash
npm install
```

## Run development server locally

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

## Create docker image and container

To dockerize the frontend application you have to Run

```bash
npm run docker:build_run
```

This command will
- Build the application
- Remove the image with the name `vps-frontend-image`
- Create the image with the name `vps-frontend-image`
- Remove the container with the name `vps-frontend`
- Run the container with the name `vps-frontend`

> This will take some time, so please be patient.

After the dockerization is complete you can view the application via the url

[http://localhost:8080/](http://localhost:8080/)