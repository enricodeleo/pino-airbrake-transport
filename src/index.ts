import { IOptions } from "@airbrake/browser";
import { Notifier } from "@airbrake/node";
import build from "pino-abstract-transport";

export const pinoLevelToSentryLevel = (level: number) => {
  if (level == 60) {
    return "critical";
  }
  if (level >= 50) {
    return "error";
  }
  if (level >= 40) {
    return "warning";
  }
  if (level >= 30) {
    return "notice";
  }
  if (level >= 20) {
    return "info";
  }
  return "debug";
};

interface PinoAirbrakeOptions {
  airbrake?: IOptions;
  minLevel?: number;
}

export default async function (PinoAirbrakeOptions: PinoAirbrakeOptions) {
  const airbrake = new Notifier(PinoAirbrakeOptions.airbrake);

  return build(async function (source) {
    for await (const obj of source) {
      const stack = obj?.err?.stack;
      const level = obj.level;

      // Filter by severity (ignore errors below level x)
      airbrake.addFilter((notice) => {
        if (notice.context.severity < PinoAirbrakeOptions.minLevel) {
          return null;
        }
        return notice;
      });

      try {
        await airbrake.notify({
          error: stack ? obj?.err : obj?.msg,
          context: {
            severity: pinoLevelToSentryLevel(level),
          },
        });
      } catch (error) {
        const consoleProperty = console.error ? "error" : "log";
        console[consoleProperty](error);
      }
    }
  });
}
