import { strict as assert } from "assert";
import { setIntervalAsync, clearIntervalAsync } from "@apigames/async-interval";
import {
  setIntervalAsync as setIntervalAsyncDynamic,
  clearIntervalAsync as clearIntervalAsyncDynamic,
} from "@apigames/async-interval/dynamic";
import {
  setIntervalAsync as setIntervalAsyncFixed,
  clearIntervalAsync as clearIntervalAsyncFixed,
} from "@apigames/async-interval/fixed";

describe("Exports", () => {
  it("should export setIntervalAsync and clearIntervalAsync from set-interval-async/dynamic ", () => {
    assert.ok(setIntervalAsyncDynamic);
    assert.ok(clearIntervalAsyncDynamic);
  });

  it("should export setIntervalAsync and clearIntervalAsync from set-interval-async/fixed ", () => {
    assert.ok(setIntervalAsyncFixed);
    assert.ok(clearIntervalAsyncFixed);
  });

  it("should export dynamic setIntervalAsync and clearIntervalAsync from set-interval-async ", () => {
    assert.equal(setIntervalAsync, setIntervalAsyncDynamic);
    assert.equal(clearIntervalAsync, clearIntervalAsyncDynamic);
  });
});
