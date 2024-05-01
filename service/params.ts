import "server-only";

import { NextResponse } from "next/server";
import { ZodObject, ZodRawShape, z } from "zod";

type QuerySchema<T extends ZodRawShape> = ZodObject<T, any>;

export const getQueryParams = <T extends ZodRawShape>(
  req: Request,
  querySchema: QuerySchema<T>
) => {
  const searchParams = new URL(req.url).searchParams;
  const queries = Object.fromEntries(searchParams.entries());

  return querySchema.safeParse(queries);
};
