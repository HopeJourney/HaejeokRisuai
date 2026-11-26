import { expect, test } from "vitest";
import {
  defaultCBSRegisterArg,
  registerCBS,
  type matcherArg,
  type RegisterCallback,
  withAxModel,
} from "./cbs";

const callbacks = new Map<string, RegisterCallback>();
const preset = { aiModel: "", subModel: "" };

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
const axmodel = () =>
  callbacks.get("axmodel")!("axmodel", {} as matcherArg, [], null);

test("{{axmodel}} returns the name of a custom model, else the id", () => {
  preset.subModel = "xcustom:::abc";
  expect(axmodel()).toBe("My Gemini");
  preset.subModel = "gemini-flash-latest";
  expect(axmodel()).toBe("gemini-flash-latest");
});

test("{{axmodel}} reports the module model inside withAxModel", () => {
  preset.subModel = "gemini-flash-latest";
  expect(withAxModel("xcustom:::abc", axmodel)).toBe("My Gemini");
  expect(withAxModel("claude-sonnet", axmodel)).toBe("claude-sonnet");
  expect(withAxModel(undefined, axmodel)).toBe("gemini-flash-latest");
  expect(axmodel()).toBe("gemini-flash-latest");
});

test("{{model}} returns the name of a custom model", () => {
  preset.aiModel = "xcustom:::abc";
  expect(model()).toBe("My Gemini");
});

test("{{model}} keeps returning the id of other models", () => {
  preset.aiModel = "gemini-flash-latest";
  expect(model()).toBe("gemini-flash-latest");
});
