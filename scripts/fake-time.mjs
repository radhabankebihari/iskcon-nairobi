// Previews and tests only: shifts this Node process's clock to FAKE_NOW (an ISO
// date such as 2027-10-15T09:00:00+03:00) and keeps it ticking. Seasonal
// homepage slides are chosen when the site is built, so build with this to see
// a slide before its date:
//
//   NODE_OPTIONS=--import=./scripts/fake-time.mjs FAKE_NOW=2027-10-15T09:00:00+03:00 npm run build
//
// In PowerShell, set $env:NODE_OPTIONS and $env:FAKE_NOW first. Never use it for
// a production build.
const target = Date.parse(process.env.FAKE_NOW ?? "");
if (!Number.isNaN(target)) {
  const RealDate = Date;
  const offset = target - RealDate.now();
  class FakeDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(RealDate.now() + offset);
      else super(...args);
    }
    static now() {
      return RealDate.now() + offset;
    }
  }
  FakeDate.UTC = RealDate.UTC;
  FakeDate.parse = RealDate.parse;
  globalThis.Date = FakeDate;
}
