import { expect, test } from "vitest";
import {
  defaultCBSRegisterArg,
  registerCBS,
  type matcherArg,
  type RegisterCallback,
} from "./cbs";

const callbacks = new Map<string, RegisterCallback>();
const preset = { aiModel: "" };

registerCBS({
  ...defaultCBSRegisterArg,
  registerFunction: ({ name, callback }) => {
    if (callback !== "doc_only") callbacks.set(name, callback);
  },
  getPresetSettings: () => preset as any,
  getModelInfo: (id: string) =>
    ({ id, name: id === "xcustom:::abc" ? "My Gemini" : id }) as any,
});

const model = () =>
  callbacks.get("model")!("model", {} as matcherArg, [], null);

test("{{model}} returns the name of a custom model", () => {
  preset.aiModel = "xcustom:::abc";
  expect(model()).toBe("My Gemini");
});

test("{{model}} keeps returning the id of other models", () => {
  preset.aiModel = "gemini-flash-latest";
  expect(model()).toBe("gemini-flash-latest");
});
