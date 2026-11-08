import { describe, expect, it } from "vitest";
import { getTempleStatus } from "./templeStatus";

function statusAt(time: string) {
  return getTempleStatus(new Date(`2026-11-04T${time}:00+03:00`));
}

describe("getTempleStatus", () => {
  it("matches the published morning opening time", () => {
    expect(statusAt("04:29")).toMatchObject({ isOpen: false, detailText: "Opens 4:30 AM" });
    expect(statusAt("04:30")).toMatchObject({ isOpen: true, detailText: "Until 1:00 PM" });
  });

  it("closes between the morning and evening sessions", () => {
    expect(statusAt("13:00")).toMatchObject({ isOpen: false, detailText: "Opens 4:20 PM" });
    expect(statusAt("16:19").isOpen).toBe(false);
  });

  it("matches the published evening hours", () => {
    expect(statusAt("16:20")).toMatchObject({ isOpen: true, detailText: "Until 8:30 PM" });
    expect(statusAt("20:30")).toMatchObject({ isOpen: false, detailText: "Opens 4:30 AM" });
  });

  it("treats the hours after midnight as closed", () => {
    expect(statusAt("00:30")).toMatchObject({ isOpen: false, detailText: "Opens 4:30 AM" });
  });

  it("names the next programme, wrapping to the next morning", () => {
    expect(statusAt("09:00").nextProgramme).toBe("Raj Bhoga Arati at 12:30 PM");
    expect(statusAt("21:00").nextProgramme).toBe("Mangala Arati at 4:30 AM");
  });
});
