import { BaseNotifier, INotice, IOptions } from '@airbrake/browser';
import { nodeFilter } from './filters/node';
import { Scope, ScopeManager } from './scope';

export class Notifier extends BaseNotifier {
  _inFlight: number;

  _scopeManager?: ScopeManager;
  _mainScope?: Scope;

  constructor(opt: IOptions) {
    if (!opt.environment && process.env.NODE_ENV) {
      opt.environment = process.env.NODE_ENV;
    }
    super(opt);

    this.addFilter(nodeFilter);

    this._inFlight = 0;

    process.on('beforeExit', async () => {
      await this.flush();
    });

    if (opt.performanceStats) {
      this._instrument();
      this._scopeManager = new ScopeManager();
    }

    this._mainScope = new Scope();
  }

  scope(): Scope {
    if (this._scopeManager) {
      const scope = this._scopeManager.active();
      if (scope) {
        return scope;
      }
    }
    return this._mainScope;
  }

  setActiveScope(scope: Scope) {
    this._scopeManager.setActive(scope);
  }

  notify(err: any): Promise<INotice> {
    this._inFlight++;
    return super.notify(err).finally(() => {
      this._inFlight--;
    });
  }

  async flush(timeout = 3000): Promise<boolean> {
    if (this._inFlight === 0 || timeout <= 0) {
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      let interval = timeout / 100;
      if (interval <= 0) {
        interval = 10;
      }

      const timerID = setInterval(() => {
        if (this._inFlight === 0) {
          resolve(true);
          clearInterval(timerID);
          return;
        }

        if (timeout <= 0) {
          resolve(false);
          clearInterval(timerID);
          return;
        }

        timeout -= interval;
      }, interval);
    });
  }

  async _instrument() {
    const mods = ['pg', 'mysql', 'mysql2', 'redis', 'http', 'https'];
    for (const modName of mods) {
      try {
        const mod = await import(`${modName}.js`);
        const airbrakeMod = await import(`@airbrake/node/dist/instrumentation/${modName}.js`);
        airbrakeMod.patch(mod, this);
      } catch (_) {
        console.error(_);
      }
    }
  }
}