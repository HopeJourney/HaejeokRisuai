import { expect, test, vi } from "vitest";

vi.mock("src/lang", () => ({ language: {} }));
vi.mock("../chatTarget", () => ({}));
vi.mock("../storage/sql/sqlStorageFactory", () => ({}));
vi.mock("../stores/domain/characterStore.svelte", () => ({}));
vi.mock("./request/chatRequestOrchestrator", () => ({}));

const { stripThoughts } = await import("./chatTitle");

test("stripThoughts drops closed and unclosed reasoning blocks", () => {
  expect(stripThoughts("<Thoughts>\nplan\n</Thoughts>\nRainy Café")).toBe(
    "Rainy Café",
  );
  expect(stripThoughts("<think>a</think>Title")).toBe("Title");
  expect(stripThoughts("Title<thinking>cut off")).toBe("Title");
  expect(stripThoughts("Plain title")).toBe("Plain title");
});
