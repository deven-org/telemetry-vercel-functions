import { Base64 } from "js-base64";
import * as github from "octonode";
import { ERRORS, MANDATORY_ENV_VARS } from "../config";

const isValidEvent = (arg) => arg && arg.body;

const areMandatoryEnvVarsSet = () => {
  const invalidVars = [];
  MANDATORY_ENV_VARS.forEach((p) => {
    if (!process.env.hasOwnProperty(p) || !p) {
      console.error(ERRORS.localEnvVarNotSet.replace("{p}", p));
    }
  });
  return invalidVars.length === 0;
};

const handler = async (event) => {
  try {
    console.log("Start...");
    if (!isValidEvent(event)) {
      throw new Error(ERRORS.invalidEvent);
    }

    if (!areMandatoryEnvVarsSet()) {
      throw new Error(
        ERRORS.localEnvVarNotSet.replace("{p}", areMandatoryEnvVarsSet())
      );
    }

    const content = {
      base64: Base64.encode(String(event.body)),
      json: event.body
    };
    console.log("Content is ready..");

    const gh = github.client(process.env.GITHUB_ACCESS_TOKEN);
    const ghrepo = gh.repo(
      `${process.env.REPO_OWNER}/${process.env.REPO_NAME}`
    );
    const path = `${process.env.REPO_PATH}/${
      content.json.repository.full_name
    }/${Date.now()}.json`;
    console.log("path", path);

    const action = content.json.action ? `- ${content.json.action}` : null;
    console.log("action", action);
    const message = `auto(data): ${content.json.repository.full_name} ${action}`;
    console.log("message", message);

    await ghrepo.createContentsAsync(
      path,
      message,
      JSON.stringify(content.json),
      process.env.TARGET_BRANCH,
      () => {
        console.log(`✅ Content has been created at ${path}.`);
      }
    );
  } catch (e) {
    let errorMessage = e instanceof Error ? e.message : e;
    console.error(`❌ ${errorMessage}`);
    return {
      statusCode: 500,
      body: JSON.stringify(errorMessage),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify("success"),
  };
};

module.exports = async (req, res) => {
  const getandpush = await handler(req);
  res.json(getandpush);
}