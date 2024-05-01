import "server-only";

import prisma from "@/lib/prisma";

// get all barangay
export const getAllBarangay = async ({ name }: { name?: string }) => {
  return await prisma.barangay.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      users:{
        where: {
          isArchived:false,
        }
      },
      items:true
    }
  });
};

// get barangay by id
export const getBarangayById = async ({ id }: { id: string }) => {
  return await prisma.barangay.findUnique({
    where: {
      id,
    },
    include: {
      items:true
    }
  });
};

//create barangay
export const createBarangay = async ({ name, zip, district }: { name: string, zip: string, district: string }) => {
  return await prisma.barangay.create({
    data: {
      name,
      zip,
      district
    },
  });
};

// update barangay by id
export const updateBarangayById = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  return await prisma.barangay.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

//delete barangay by id
export const deleteBarangayById = async ({ id }: { id: string }) => {
  return await prisma.barangay.delete({
    where: {
      id,
    },
  });
};
