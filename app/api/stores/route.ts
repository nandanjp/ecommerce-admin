import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request
)
{
    try
    {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId)
        {
            return new Response("Unauthorized", { status: 401 });
        }

        if (!name)
        {
            return new Response("Name is required", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return Response.json(store);
    } catch (error)
    {
        console.log(`[STORES_POST]: ${error}`);
        return new Response("Internal Error", { status: 500 });
    }
}