import { createBlogInput, updateBlogInput } from "@mutaliksamarth/zod-inference-medium-blog";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

const prisma = new PrismaClient().$extends(withAccelerate());

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            });
        }
    } catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        });
    }
});

blogRouter.post('/create', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success, error } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({
            message: "Inputs not correct",
            error: error?.issues
        });
    }

    const authorId = c.get("userId");

    try {
        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: Number(authorId)
            }
        });

        return c.json({
            id: blog.id
        });
    } catch (e) {
        console.error("Error creating blog post:", e);
        c.status(500);
        return c.json({
            message: "Error creating blog post"
        });
    }
});

blogRouter.put('/update', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success, error } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({
            message: "Inputs not correct",
            error: error?.issues
        });
    }

    try {
        const blog = await prisma.blog.update({
            where: {
                id: body.id
            }, 
            data: {
                title: body.title,
                content: body.content
            }
        });

        return c.json({
            id: blog.id
        });
    } catch (e) {
        console.error("Error updating blog post:", e);
        c.status(500);
        return c.json({
            message: "Error updating blog post"
        });
    }
});

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({
        blogs
    })
})

blogRouter.get('/me', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const userId = c.get("userId");

    try {
        const blogs = await prisma.blog.findMany({
            where: {
                authorId: Number(userId)
            },
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json({
            blogs
        });
    } catch(e) {
        console.error("Error fetching user's blogs:", e);
        c.status(500);
        return c.json({
            message: "Error fetching user's blogs"
        });
    }
});

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    const id = c.req.param("id");

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                },
                authorId: true,
            }
        });

        if (!blog) {
            c.status(404);
            return c.json({
                message: "Blog post not found"
            });
        }

        return c.json({
            blog
        });
    } catch(e) {
        console.error("Error fetching blog post:", e);
        c.status(500);
        return c.json({
            message: "Error fetching blog post"
        });
    }
});

blogRouter.delete('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    const id = c.req.param("id");

    try {
        await prisma.blog.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({
            message: "Blog post deleted"
        });
    } catch(e) {
        console.error("Error deleting blog post:", e);
        c.status(500);
        return c.json({
            message: "Error deleting blog post"
        });
    }
});