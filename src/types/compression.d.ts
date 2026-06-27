declare module 'compression' {
  import { RequestHandler } from 'express';

  interface CompressionOptions {
    filter?: (req: unknown, res: unknown) => boolean;
    level?: number;
    threshold?: number | string;
  }

  function compression(options?: CompressionOptions): RequestHandler;

  export default compression;
}
