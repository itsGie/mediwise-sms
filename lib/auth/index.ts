import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { Role, User } from "@prisma/client";
import { Session } from "next-auth";

// export interface Session {
//   user: {
//     email: string;
//     id: string;
//     name: string;
//     image?: string;
//     role: Role;
//   };
// }

export const getSession = async () => {
  return await getServerSession(authOptions);
};

interface WithAuthHandler {
  ({
    req,
    params,
    searchParams,
    headers,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    headers?: Record<string, string>;
    session: Session;
    currentUser?: User;
  }): Promise<Response>;
}

interface RequiredRole {
  requiredRole?: Array<Role>;
  allowAnonymous?: boolean;
}

export const withAuth =
  (
    handler: WithAuthHandler,
    { requiredRole = [], allowAnonymous = false }: RequiredRole = {}
  ) =>
  async (
    req: Request,
    { params }: { params: Record<string, string> | undefined }
  ) => {
    const searchParams = getSearchParams(req);

    let session: Session | null;
    let headers = {};

    session = await getSession();
    console.log("🚀 ~ file: index.ts:55 ~ session:", session);

    if (allowAnonymous && req.method === "GET") {
      session = {
        expires: "",
        user: {
          email: "",
          id: "",
          name: "",
          barangayId: "",
          role: "ANONYMOUS",
        },
      };

      return handler({
        req,
        params: params || {},
        searchParams,
        headers,
        session,
      });
    }

    if (!session) {
      return new Response("Unauthorized: Login required.", {
        status: 401,
        headers,
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        role: session.user.role,
      },
    });

    if (!user) {
      return new Response("Unauthorized: Login required.", {
        status: 401,
        headers,
      });
    }

    if (requiredRole.length > 0 && !requiredRole.includes(user.role)) {
      return new Response("Unauthorized: Role required.", {
        status: 401,
        headers,
      });
    }

    return handler({
      req,
      params: params || {},
      searchParams,
      headers,
      session,
      currentUser: user,
    });
  };

const getSearchParams = (req: Request) => {
  return Object.fromEntries(new URL(req.url).searchParams);
};
