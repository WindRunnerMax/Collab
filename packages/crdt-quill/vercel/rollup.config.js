import getConfig from "../rollup.config.js";
import replace from "@rollup/plugin-replace";

export default async () => {
  const config = await getConfig();
  return {
    ...config,
    plugins: [
      ...config.plugins,
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "ws://localhost:3001": 'ws://" + location.host + "/api/ws',
        "preventAssignment": true,
      }),
    ],
  };
};
