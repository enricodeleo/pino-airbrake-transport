# Pino Airbrake transport

![NPM](https://img.shields.io/npm/l/pino-airbrake-transport)
![NPM](https://img.shields.io/npm/v/pino-airbrake-transport)
![GitHub Workflow Status](https://github.com/enricodeleo/pino-airbrake-transport/actions/workflows/pino-airbrake-transport.yml/badge.svg?branch=main)

This module provides a 'transport' for pino that sends errors to [Airbrake](https://airbrake.io?ref=enricodeleo.com).

## Install

```shell
npm i pino-airbrake-transport
```

## usage

```typescript
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-airbrake-transport",
    options: {
      airbrake: {
        projectId: 1,
        projectKey: "REPLACE_ME",
        environment: "production",
        // aditional options for airbrake
        performanceStats: false,
      },
    },
    level: "info", // minimum log level that should be sent to Airbrake
  },
});
```

## Credits

Originally forked from [tomer-yechie's Sentry implementation](https://github.com/tomer-yechiel/pino-sentry-transport)
