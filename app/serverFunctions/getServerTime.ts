// getServerTime.ts
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";

export const getServerTime = createServerFn({
  method: "GET",
})
  .validator((data: string) => data)
  .handler(async (context) => {
    const request = getWebRequest();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
      new Date().toISOString() + context.data + JSON.stringify(request.headers)
    );
  });
