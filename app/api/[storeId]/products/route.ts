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
        const { name, price, categoryId, sizeId, images, isFeatured } = body;

        if (!userId)
        {
            return new Response("Unauthenticated", { status: 403 });
        }
        if (!name)
        {
            return new Response("Name is required", { status: 400 });
        }
        if (!images || !images.length)
        {
            return new Response("Images are required", { status: 400 });
        }
        if (!price)
        {
            return new Response("Price is required", { status: 400 });
        }
        if (!categoryId)
        {
            return new Response("Category Id is required", { status: 400 });
        }
        if (!sizeId)
        {
            return new Response("Size Id is required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                categoryId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string; }) => image)
                        ]
                    }
                }
            }
        });

        return Response.json(product);
    } catch (error)
    {
        console.log("[PRODUCTS_POST", error);
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
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId)
        {
            return new Response("Store id is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                sizeId,
                isFeatured: isFeatured ? true : undefined
            },
            include: {
                images: true,
                category: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return Response.json(products);
    } catch (error)
    {
        console.log("[PRODUCTS_GET]", error);
        return new Response("Internal error", { status: 500 });
    }
}