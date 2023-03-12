# Creator Serverless applications

This project are using the serverless framework to create all apps.
The idea is provider a platform to make more easier when you need to create
a new microservice without need to do a lot of configuration.

## Usage

Install dependencies with:

```
npm install
```

Create new App:

```
npm run create:app
```

Provide all necessary information that will be required in terminal

To test in you local environment run

```
  npm run local
```

To deploy you new app or some change in you app, run

```
  npm run deploy
```

You need the SDK configured properly related the provider that you are using (AWS, GCP, AZURE...)
