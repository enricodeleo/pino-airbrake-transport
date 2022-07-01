# Pino Aibrake transport

![NPM](https://img.shields.io/npm/l/pino-aibrake-transport)
![NPM](https://img.shields.io/npm/v/pino-aibrake-transport)
![GitHub Workflow Status](https://github.com/enricodeleo/pino-airbrake-transport/actions/workflows/pino-aibrake-transport.yml/badge.svg?branch=main)

This module provides a 'transport' for pino that sends errors to [Aibrake](https://airbrake.io?ref=enricodeleo.com).

## Install

```shell
npm i pino-aibrake-transport
```

## usage

```typescript
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-aibrake-transport",
    options: {
      aibrake: {
        projectId: 1,
        projectKey: "REPLACE_ME",
        environment: "production",
        // aditional options for aibrake
        performanceStats: false,
      },
    },
    level: "info", // minimum log level that should be sent to Aibrake
  },
});
```

## Credits

Originally forked from [tomer-yechie's Sentry implementation](https://github.com/tomer-yechiel/pino-sentry-transport)
