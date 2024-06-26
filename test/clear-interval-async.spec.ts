import { install, InstalledClock } from "@sinonjs/fake-timers";
import sinon from "sinon";
import { strict as assert } from "assert";
import {
  setIntervalAsync as setIntervalAsyncDynamic,
  clearIntervalAsync as clearIntervalAsyncDynamic,
  SetIntervalAsyncTimer,
} from "@cloudize/async-interval/dynamic";
import {
  setIntervalAsync as setIntervalAsyncFixed,
  clearIntervalAsync as clearIntervalAsyncFixed,
} from "@cloudize/async-interval/fixed";

for (const [strategy, setIntervalAsync, clearIntervalAsync] of [
  ["Dynamic", setIntervalAsyncDynamic, clearIntervalAsyncDynamic],
  ["Fixed", setIntervalAsyncFixed, clearIntervalAsyncFixed],
] as const) {
  describe(`[${strategy}] clearIntervalAsync`, () => {
    let clock: InstalledClock;

    beforeEach(() => {
      clock = install();
    });

    afterEach(() => {
      clock.uninstall();
    });

    it("should fail if timer is not an instance of SetIntervalAsyncTimer", async () => {
      const invalidTimers = [null, undefined, 0, "str", {}, []];
      for (const invalidTimer of invalidTimers) {
        try {
          await clearIntervalAsync(invalidTimer as SetIntervalAsyncTimer<[]>);
          assert.fail("Did not throw");
        } catch (err: unknown) {
          assert.ok(err instanceof TypeError);
        }
      }
    });

    it(`should stop running successfully before the first iteration`, async () => {
      const intervalMs = 100;
      const handler = sinon.fake(async () => {
        /* empty */
      });
      const timer = setIntervalAsync(handler, intervalMs);
      await clearIntervalAsync(timer);
      assert.equal(handler.callCount, 0);
    });

    it(`should stop running successfully after the first iteration`, async () => {
      const iterationCount = 10;
      const intervalMs = 100;
      const handler = sinon.fake(async () => {
        /* empty */
      });
      const timer = setIntervalAsync(handler, intervalMs);
      for (let iteration = 1; iteration <= iterationCount; ++iteration) {
        await clock.nextAsync();
      }
      await clearIntervalAsync(timer);
      assert.equal(handler.callCount, iterationCount);
      await clock.nextAsync();
      assert.equal(handler.callCount, iterationCount);
    });

    it(`should stop running successfully in the middle of an iteration`, async () => {
      const intervalMs = 1000;
      const handler = sinon.fake(async () => {
        await new Promise((resolve) => clock.setTimeout(resolve, 100));
        await new Promise((resolve) => clock.setTimeout(resolve, 100));
      });
      const timer = setIntervalAsync(handler, intervalMs);
      await clock.nextAsync();
      await clock.nextAsync();
      const cleared = clearIntervalAsync(timer);
      await clock.nextAsync();
      await cleared;
    });

    it(`should throw if the last iteration throws`, async () => {
      const intervalMs = 100;
      const handler = sinon.fake(async () => {
        throw new Error("Some Error");
      });
      const timer = setIntervalAsync(handler, intervalMs);
      await clock.nextAsync();
      try {
        await clearIntervalAsync(timer);
        assert.fail("Did not throw.");
      } catch (_) {
        /* empty */
      }
    });
  });
}
