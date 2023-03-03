export const ERRORS = {
    invalidEvent: "The event is not valid",
    invalidRequest: "Invalid request: the body isn't a valid JSON string.",
    localEnvVarNotSet: "The environment variable {p} is not correctly set",
    skippingRepo: "This is a telemetry data repository, skipping",
  };
  
  export const MANDATORY_ENV_VARS = [
    "REPO_NAME",
    "REPO_OWNER",
    "TARGET_BRANCH",
    "GITHUB_ACCESS_TOKEN"
  ];
  