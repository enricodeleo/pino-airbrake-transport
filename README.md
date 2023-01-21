# Pino Airbrake transport

![NPM](https://img.shields.io/npm/l/pino-airbrake-transport)
![NPM](https://img.shields.io/npm/v/pino-airbrake-transport)
![GitHub Workflow Status](https://github.com/enricodeleo/pino-airbrake-transport/actions/workflows/pino-airbrake-transport.yml/badge.svg?branch=main)

This module provides a _transport_ for [Pino](https://getpino.io/?ref=enricodeleo.com) that sends errors to [Airbrake](https://airbrake.io?ref=enricodeleo.com).

Thanks to this module you can automatically transmit logs, stacktrace and context from pino to Aibrake.io. The best part is that this happens in a worker thread so that the impact of logging is reduced to the minimum.

## Install

### npm

```shell
npm i pino-airbrake-transport
```

### yarn

```shell
yarn add pino-airbrake-transport
```

## Usage

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
        // additional options for airbrake
        performanceStats: false,
      },
    },
    level: "info", // minimum log level that should be sent to Airbrake
  },
});
```

## Credits

Originally forked from [tomer-yechie's Sentry implementation](https://github.com/tomer-yechiel/pino-sentry-transport)
