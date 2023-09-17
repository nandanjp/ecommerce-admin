import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string; }; }
)
{
    try
    {
        if (!params.categoryId)
        {
            return new Response("Category id is required", { status: 400 });
        }
        const size = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            }
        });

        return Response.json(size);
    } catch (error)
    {
        console.log(`[CATEGORY_GET]`, error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { categoryId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = auth();
        const body = await req.json();
        const { name } = body;

        if (!userId)
        {
            return new Response("Unauthenticated", { status: 403 });
        }
        if (!name)
        {
            return new Response("Name is required", { status: 400 });
        }
        if (!params.categoryId)
        {
            return new Response("Size id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId)
        {
            return new Response("Unauthorized", { status: 405 });
        }

        const category = await prismadb.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
            }
        });

        return Response.json(category);

    } catch (error)
    {
        console.log(`[CATEGORY_PATCH]`, error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { categoryId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = auth();

        if (!userId)
        {
            return new Response("Unauthenticated", { status: 403 });
        }
        if (!params.categoryId)
        {
            return new Response("Size id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.categoryId,
                userId
            }
        });

        if (!storeByUserId)
        {
            return new Response("Unauthorized", { status: 405 });
        }

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            },
        });

        return Response.json(category);

    } catch (error)
    {
        console.log(`[CATEGORY_DELETE]`, error);
        return new Response("Internal error", { status: 500 });
    }
}