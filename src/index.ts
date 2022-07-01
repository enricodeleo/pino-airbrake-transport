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

interface PinoAibrakeOptions {
  aibrake?: IOptions;
  minLevel?: number;
}

export default async function (PinoAibrakeOptions: PinoAibrakeOptions) {
  const airbrake = new Notifier(PinoAibrakeOptions.aibrake);

  return build(async function (source) {
    for await (const obj of source) {
      const stack = obj?.err?.stack;
      const errorMessage = obj?.err?.message;
      const level = obj.level;

      // Filter by severity (ignore errors below level x)
      airbrake.addFilter((notice) => {
        if (notice.context.severity < PinoAibrakeOptions.minLevel) {
          return null;
        }
        return notice;
      });

      airbrake.notify({
        error: stack ? obj?.err : errorMessage,
        context: {
          severity: pinoLevelToSentryLevel(level),
        },
      });
    }
  });
}
