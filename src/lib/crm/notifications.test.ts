import { describe, expect, it } from "vitest";
import { addNotification, getNotifications, markNotificationRead } from "./notifications";
import { setupIsolatedRedis } from "./testRedis";

// Integration tests for the in-app notification center against an isolated store.
setupIsolatedRedis("notifications");

const U = "user-1";

describe("notifications store", () => {
  it("adds notifications newest-first, unread, omitting absent optional fields", async () => {
    await addNotification(U, { type: "email_opened", title: "first" });
    await addNotification(U, { type: "reply", title: "second", body: "hi", leadId: "L1" });

    const list = await getNotifications(U);
    expect(list.map((x) => x.title)).toEqual(["second", "first"]); // newest at head
    expect(list[0]).toMatchObject({ type: "reply", title: "second", body: "hi", leadId: "L1", read: false });
    expect(list[1].body).toBeUndefined();
    expect(list[1].leadId).toBeUndefined();
  });

  it("caps the list at 100 entries, keeping the newest", async () => {
    for (let i = 0; i < 105; i++) await addNotification(U, { type: "t", title: `n${i}` });
    const list = await getNotifications(U);
    expect(list).toHaveLength(100);
    expect(list[0].title).toBe("n104"); // newest
    expect(list[99].title).toBe("n5");  // n0..n4 trimmed off the tail
  });

  it("marks a single notification read by id, leaving others unread", async () => {
    const a = await addNotification(U, { type: "t", title: "a" });
    await addNotification(U, { type: "t", title: "b" });

    await markNotificationRead(U, a.id);
    const list = await getNotifications(U);
    expect(list.find((x) => x.id === a.id)!.read).toBe(true);
    expect(list.find((x) => x.title === "b")!.read).toBe(false);
  });

  it("marks all read with __all__ and preserves order", async () => {
    await addNotification(U, { type: "t", title: "x" });
    await addNotification(U, { type: "t", title: "y" });

    await markNotificationRead(U, "__all__");
    const list = await getNotifications(U);
    expect(list.every((x) => x.read)).toBe(true);
    expect(list.map((x) => x.title)).toEqual(["y", "x"]);
  });
});
