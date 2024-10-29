import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@mutaliksamarth/zod-inference-medium-blog"

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({
      message: "Inputs not correct"
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name
      }
    });
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json({ token: jwt });
  } catch(e) {
    console.log(e);
    c.status(500);
    return c.json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({
      message: "Inputs not correct"
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      }
    });
    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect credentials"
      });
    }
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET);

    return c.json({ token: jwt });
  } catch(e) {
    console.log(e);
    c.status(500);
    return c.json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});