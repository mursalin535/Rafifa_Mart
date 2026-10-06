import Rollbar from "rollbar";

const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    code_version: "1.0.0",
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: "1.0.0",
        guess_uncaught_frames: true,
      },
    },
  },
});

export default rollbar;
