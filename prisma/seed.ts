import { Gender, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
// import * as fs from "fs";
// import * as path from "path";
// import { parse } from "csv-parse";
import { barangayItemsData, barangayNames } from "./data";
const prisma = new PrismaClient();
/* 
Database seeding happens in two ways with Prisma: manually with prisma db seed and automatically in prisma migrate dev and prisma migrate reset.

To seed the database, run the db seed CLI command:
$ npx prisma db seed

To reset the database and seed it using db push
$ npx prisma migrate reset --skip-seed
$ npx prisma db push    // push the schema to the database first
$ npx prisma generate  // (optional)
$ npx prisma db seed  // then you can seed the database

OR

$ npx prisma db push --force-reset
$ npx prisma db seed

*/
let spacialist = [
  "Dentist",
  "Nurse",
  "General Practitioners",
  "Pediatrician",
  "Pharmacist",
];
let dosage = ["kg", "g", "mg", "mgc", "L", "mL", "cc", "mol", "mmol"];
let unit = ["pcs", "box"];

type BarangayItemsType = (typeof barangayItemsData)[number];

type DrugProducts = {
  RegistrationNumber: string;
  GenericName: string;
  BrandName: string;
  DosageStrength: string;
  DosageForm: string;
  Manufacturer: string;
  CountryofOrigin: string;
  IssuanceDate: string;
  ExpiryDate: string;
};

const password = bcrypt.hashSync("@Dev1234", 12);

const generateItems = async () => {
  return {
    stock: faker.number.int({
      min: 99,
      max: 499,
    }),
    dosage: faker.helpers.arrayElement(dosage),
    unit: faker.helpers.arrayElement(unit),
  };
};

const generateFakeUser = () => {
  return {
    email: faker.internet.email(),
    hashedPassword: password,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    middleName: faker.person.middleName(),
    gender: faker.helpers.enumValue(Gender),
    dateOfBirth: faker.date.between({
      from: "2000-01-01T00:00:00.000Z",
      to: "2005-01-01T00:00:00.000Z",
    }),
    homeNo: faker.location.buildingNumber(),
    street: faker.location.street(),
    barangay: faker.location.state(),
    city: faker.location.city(),
    contactNo: faker.phone.number(),
  };
};

// create barangay
const createBarangay = async (
  name: string,
  zip: string,
  district: string,
  drugProducts: BarangayItemsType[]
) => {
  const barangay = await prisma.barangay.create({
    data: {
      name: name,
      zip, 
      district
    },
    select: {
      id: true,
    },
  });

  // create barangay items
  await Promise.all(
    drugProducts.map(async (record) => {
      // const newItems = await generateItems();

      await prisma.brgyItem.create({
        data: {
          name: record.name,
          description: record.description,
          barangayId: barangay.id,
          stock: record.stock,
          dosage: record.dosage,
          unit: record.unit,
        },
      });
    })
  );

  // create barangay admin
  await createUser({ role: "ADMIN", barangayId: barangay.id });

  // create barangay doctors
  await Promise.all(
    Array.from({ length: 2 }).map(async () => {
      await createUser({ role: "DOCTOR", barangayId: barangay.id });
    })
  );

  // create barangay clients
  await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      await createUser({ role: "PATIENT", barangayId: barangay.id });
    })
  );
};

// create user n times
const createUser = async ({
  role,
  barangayId,
}: {
  role: Role;
  barangayId?: string;
}) => {
  // const barangayIds = await prisma.barangay.findMany({
  //   select: {
  //     id: true,
  //   },
  // });

  const fake = generateFakeUser();

  // if admin or doctor make verified true
  const specialist = "Doctor";
  const licenseNo = faker.number
    .bigInt({
      min: 100000000000,
      max: 999999999999,
    })
    .toString();

  const user = await prisma.user.create({
    data: {
      isArchived: false,
      name: fake.firstName + " " + fake.lastName,
      email: `${role.toLocaleLowerCase()}.${fake.email}`,
      image: faker.image.avatar(),
      hashedPassword: password,
      role: Role[role as keyof typeof Role], // convert string to enum
      isVerified: true,
      profile: {
        create: {
          firstname: fake.firstName,
          lastname: fake.lastName,
          middlename: fake.middleName,
          gender: fake.gender,
          dateOfBirth: fake.dateOfBirth,
          homeNo: fake.homeNo,
          street: fake.street,
          barangay: fake.barangay,
          city: fake.city,
          contactNo: fake.contactNo,
          specialist:
            role === "DOCTOR"
              ? faker.helpers.arrayElement(spacialist)
              : undefined,
          licenseNo: role === "DOCTOR" ? licenseNo : undefined,
        },
      },
      barangayId: barangayId,
    },
  });

  return user;
};

async function main() {
  // console.log("READING CSV FILE...");
  // // get csv path on same directory
  // const csvFilePath = path.resolve(__dirname, "ALL_DrugProducts.csv");
  // const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
  // const headers = [
  //   "RegistrationNumber",
  //   "GenericName",
  //   "BrandName",
  //   "DosageStrength",
  //   "DosageForm",
  //   "Manufacturer",
  //   "CountryofOrigin",
  //   "IssuanceDate",
  //   "ExpiryDate",
  // ];

  // const drugProducts: DrugProducts[] = [];

  // // parse csv file
  // await new Promise((resolve, reject) => {
  //   parse(fileContent, { columns: headers, from_line: 2 }, (err, data) => {
  //     if (err) {
  //       reject(err);
  //     }

  //     drugProducts.push(...data);
  //     resolve(data);
  //   });
  // });

  // console.log("READING CSV FILE COMPLETE...");

  console.log("CREATING STOCK_MANAGER...");
  // SMS ADMIN
  await createUser({ role: "STOCK_MANAGER" });

  //  get 10 items from drugProducts
  // const items = drugProducts.slice(0, 10);
  const items = barangayItemsData;

  console.log("CREATING BARANGAY WITH ITEMS, ADMIN , CLIENTS , DOCTORS...");
  // barangay
  // await createBarangay("174", items);
  for (const barangayName of barangayNames) {
    await createBarangay(barangayName.barangayName, barangayName.zip.toString(), barangayName.district, items);
  }

  console.log("CREATING SMS ITEMS...");
  // create sms items
  await Promise.all(
    items.map(async (record) => {
      // const newItems = await generateItems();

      await prisma.smsItem.create({
        data: {
          name: record.name,
          description: record.description,
          stock: record.stock,
          unit: record.unit,
          dosage: record.dosage,
        },
      });
    })
  );
  // await Promise.all(
  //   drugProducts.map(async (record) => {
  //     const newItems = await generateItems();

  //     await prisma.smsItem.create({
  //       data: {
  //         name: record.BrandName,
  //         description: record.GenericName,
  //         stock: newItems.stock,
  //         unit: newItems.unit,
  //       },
  //     });
  //   })
  // );

  // stock manager
  // await createUser({ role: "STOCK_MANAGER" });

  // doctors
  // await Promise.all(
  //   Array.from({ length: 10 }).map(async () => {
  //     await createUser({ role: "DOCTOR" });
  //   })
  // );

  // patients
  // await Promise.all(
  //   Array.from({ length: 10 }).map(async () => {
  //     await createUser({ role: "PATIENT" });
  //   })
  // );

  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
