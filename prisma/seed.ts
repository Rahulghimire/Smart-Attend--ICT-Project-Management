import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  // Create users with posts
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      posts: {
        create: [
          {
            title: 'Hello World',
            content: 'This is my first post',
            published: true,
          },
          {
            title: 'Draft Post',
            content: 'This is a draft',
            published: false,
          },
        ],
      },
    },
  })
  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
    },
  })
  console.log({ alice, bob })
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
