const fs = require("fs");
const yaml = require("js-yaml");

export const readFromDotEnvless = async () => {};

export const writeToDotEnvless = async (data: object) => {
  let config;

  try {
    const doc = await yaml.load(fs.readFileSync("./.envless.yml", "utf8"));
    config = { ...doc, ...data };
  } catch (e) {
    config = data;
  }

  await fs.writeFileSync("./.envless.yml", yaml.dump(config));
};