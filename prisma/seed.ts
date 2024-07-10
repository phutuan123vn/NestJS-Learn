import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const Users: string[] = [
    'ptt@gmail.com',
    'ptt1@gmail.com',
]

// import { CreateAccountDto } from "src/Account/dto/create-account.dto";

async function main() {
    for (const email of Users) {
        await prisma.user.create({
          data: {
            email: email,
            password: await bcrypt.hash('123', 10),
          },
        });
    }
}


main()
 .then(async () => {
    await prisma.$disconnect();
 })
 .catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
 })