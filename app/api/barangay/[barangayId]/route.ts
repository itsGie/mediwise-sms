import { withAuth } from "@/lib/auth";
import { UpdateBarangaySchema } from "@/schema/barangay";
import {
  deleteBarangayById,
  getBarangayById,
  updateBarangayById,
} from "@/service/barangay";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      barangayId: string;
    };
  }
) {
  try {
    const barangay = await getBarangayById({
      id: params.barangayId,
    });

    if (!barangay) {
      return NextResponse.json(
        {
          message: "Barangay not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(barangay);
  } catch (error) {
    console.log("[BARANGAY_GET_BY_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const PATCH = withAuth(
  async ({ req, session, params }) => {
    try {
      const body = await UpdateBarangaySchema.safeParseAsync(await req.json());

      if (!body.success) {
        return NextResponse.json(
          {
            errors: body.error.flatten().fieldErrors,
            message: "Invalid body parameters",
          },
          { status: 400 }
        );
      }

      const { name } = body.data;

      const barangay = await getBarangayById({
        id: params.barangayId,
      });

      if (!barangay) {
        return NextResponse.json(
          {
            message: "Barangay not found",
          },
          { status: 404 }
        );
      }

      const barangayUpdated = await updateBarangayById({
        id: params.barangayId,
        name: name,
      });

      return NextResponse.json(barangayUpdated, { status: 201 });
    } catch (error) {
      console.log("[BARANGAY_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN"],
  }
);

export const DELETE = withAuth(
  async ({ req, session, params }) => {
    try {
      const barangay = await getBarangayById({
        id: params.barangayId,
      });

      if (!barangay) {
        return NextResponse.json(
          {
            message: "Barangay not found",
          },
          { status: 404 }
        );
      }

      const barangayDeleted = await deleteBarangayById({
        id: params.barangayId,
      });

      return NextResponse.json(barangayDeleted, { status: 200 });
    } catch (error) {
      console.log("[BARANGAY_DELETE]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  },
  {
    requiredRole: ["ADMIN"],
  }
);
