import ogImageHandler from "./og-images/handler.tsx";
import { serveFunctions } from "./runtime/serve-functions.ts";

serveFunctions({ ["/og-images"]: ogImageHandler });
