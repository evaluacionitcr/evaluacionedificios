import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const dynamic = "force-dynamic";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    isDev: process.env.NODE_ENV === "development",
  }
  
});
