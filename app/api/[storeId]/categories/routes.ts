import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string; }; }
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
        if (!params.storeId)
        {
            return new Response("Store id is required", { status: 400 });
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

        const category = await prismadb.category.create({
            data: {
                name,
                storeId: params.storeId
            }
        });

        return Response.json(category);
    } catch (error)
    {
        console.log("[CATEGORIES_POST", error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string; }; }
)
{
    try
    {
        if (!params.storeId)
        {
            return new Response("Store id is required", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return Response.json(categories);
    } catch (error)
    {
        console.log("[CATEGORIES_GET]", error);
        return new Response("Internal error", { status: 500 });
    }
}