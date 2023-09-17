import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { sizeId: string; }; }
)
{
    try
    {

        if (!params.sizeId)
        {
            return new Response("Size id is required", { status: 400 });
        }
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        });

        return Response.json(size);
    } catch (error)
    {
        console.log(`[SIZE_GET]`, error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { sizeId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId)
        {
            return new Response("Unauthenticated", { status: 403 });
        }
        if (!name)
        {
            return new Response("Name is required", { status: 400 });
        }
        if (!value)
        {
            return new Response("Value is required", { status: 400 });
        }
        if (!params.sizeId)
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

        const size = await prismadb.size.update({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });

        return Response.json(size);

    } catch (error)
    {
        console.log(`[SIZE_PATCH]`, error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { sizeId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = auth();

        if (!userId)
        {
            return new Response("Unauthenticated", { status: 403 });
        }
        if (!params.sizeId)
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

        const size = await prismadb.size.delete({
            where: {
                id: params.sizeId,
            },
        });

        return Response.json(size);

    } catch (error)
    {
        console.log(`[SIZE_DELETE]`, error);
        return new Response("Internal error", { status: 500 });
    }
}