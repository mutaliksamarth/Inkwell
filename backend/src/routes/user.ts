import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
// Removed duplicate import of sign
import { signupInput, signinInput } from "@mutaliksamarth/zod-inference-medium-blog"
import * as bcrypt from 'bcryptjs'

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
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
    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword, // Store hashed password
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
        email: body.email
      }
    });

    if (!user) {
      c.status(403);
      return c.json({
        message: "Incorrect credentials"
      });
    }

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
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

// Import verify from hono/jwt
import { sign, verify } from 'hono/jwt'

// Add this interface for type safety
interface JWT {
  id: string;
}

// Add this middleware to verify JWT token
async function authMiddleware(c: any, next: any) {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1];
    console.log(token);
    if (!token) {
      c.status(401);
      return c.json({ message: 'Unauthorized' });
    }

    const decoded = await verify(token, c.env.JWT_SECRET) as unknown as JWT;
    c.set('userId', decoded.id);
    await next();
  } catch (e) {
    c.status(401);
    return c.json({ message: 'Unauthorized' });
  }
}
// Add the /me endpoint to get user info
userRouter.get('/me', authMiddleware, async (c) => {
  const userId = c.get('userId') as string;
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      select: {
        id: true,
        email: true,
        name: true,
        // Don't select password for security
      }
    });

    if (!user) {
      c.status(404);
      return c.json({ message: 'User not found' });
    }

    return c.json(user);
  } catch(e) {
    console.log(e);
    c.status(500);
    return c.json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

// Rest of your existing code remains the same...