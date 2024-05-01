import "server-only";

import prisma from "@/lib/prisma";
import { Gender, Profile, Role, User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  TRegister,
  TUpdateProfile,
  TUpdateUserSchema,
  TUser,
  TUserRaw,
} from "@/schema/user";
import { da } from "@faker-js/faker";
import { TBarangay } from "@/schema/barangay";

export const generateHashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const userAllowedFields = {
  id: true,
  isArchived: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  role: true,
  barangayId: true,
  isVerified: true,
  vefificationCode: true,
  profile: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      middlename: true,
      suffix: true,
      gender: true,
      specialist: true,
      licenseNo: true,
      dateOfBirth: true,
      homeNo: true,
      street: true,
      barangay: true,
      city: true,
      contactNo: true,
      zip: true,
      district: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  },
  barangay:true,
};

export const getAllUsers = async ({
  name,
  email,
  role,
  barangayId,
}: {
  name?: string;
  email?: string;
  barangayId?: string;
  role?: Role | undefined;
}): Promise<TUser[]> => {
  return await prisma.user.findMany({
    where: {
      barangayId: barangayId ?? undefined,
      name: {
        contains: name,
      },
      email: {
        contains: email,
      },
      role: {
        equals: role,
      },
      isArchived:false,
    },
    select: userAllowedFields,
  });
};



export const getUserById = async ({
  id,
  role
}: {
  id: string;
  role?: Role
}) => {
  const data = await prisma.user.findUnique({
    where: {
      id,
      role
    },
    include: {
      profile:true,
      barangay:true,
    }
  });

  return data;
};
export type TGetUserById = Awaited<ReturnType<typeof getUserById>>;

export const createUser = async ({
  data: {
    email,
    hashedPassword,
    vefificationCode,
    role,
    firstname,
    middlename,
    lastname,
    suffix,
    gender,
    dateOfBirth,
    homeNo,
    street,
    barangay,
    city,
    contactNo,
    zip,
    district
  },
}: {
  data: Omit<TRegister, "confirmPassword" | "password"> & {
    hashedPassword: string;
    vefificationCode: string;
  };
}): Promise<TUser> => {
  return await prisma.user.create({
    data: {
      email,
      hashedPassword,
      vefificationCode,
      role,
      barangayId: barangay,
      profile: {
        create: {
          district,
          firstname,
          lastname,
          middlename,
          suffix,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          homeNo,
          street,
          barangay,
          city : 'Caloocan',
          contactNo,
          zip
        },
      },
    },
    select: userAllowedFields,
  });
};

export const updateUserById = async ({
  id,
  data,
}: {
  id: string;
  data: TUpdateUserSchema;
}): Promise<TUser> => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: data.role,
      image: data.imageUrl,
      barangayId: data.barangayId,
    },
    select: userAllowedFields,
  });
};

export const updateProfileById = async ({
  id,
  firstname,
  middlename,
  lastname,
  suffix,
  gender,
  dateOfBirth,
  homeNo,
  street,
  barangay,
  city,
  contactNo,
  isVerified,
}: TUpdateProfile & { id: string; isVerified?: boolean }): Promise<TUser> => {
  return await prisma.profile.update({
    where: {
      id: id,
    },
    data: {
      firstname,
      middlename,
      lastname,
      suffix,
      gender,
      dateOfBirth,
      homeNo,
      street,
      barangay,
      city,
      contactNo,
      user: {
        update: {
          isVerified,
        },
      },
    },
    select: userAllowedFields,
  });
};

export const updateUserPasswordById = async ({
  id,
  hashedPassword,
}: {
  id: string;
  hashedPassword: string;
}): Promise<TUser> => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      hashedPassword,
    },
    select: userAllowedFields,
  });
};

export const getUserByEmail = async ({
  email,
  enableRawData = false,
}: {
  email: string;
  enableRawData?: boolean;
}): Promise<TUser & {barangay?: TBarangay} | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: enableRawData ? undefined : userAllowedFields,
  });
};
