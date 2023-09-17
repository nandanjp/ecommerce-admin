import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { productId: string; }; }
)
{
    try
    {
        if (!params.productId)
        {
            return new Response("Category id is required", { status: 400 });
        }
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true
            }
        });

        return Response.json(product);
    } catch (error)
    {
        console.log(`[PRODUCT_GET]`, error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { productId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = auth();
        const body = await req.json();
        const { name, price, categoryId, images, sizeId, isFeatured } = body;

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
        if (!params.productId)
        {
            return new Response("Product id is required", { status: 400 });
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
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
        console.log(`[PRODUCT_PATH]`, error);
        return new Response("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { productId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = auth();

        if (!userId)
        {
            return new Response("Unauthenticated", { status: 403 });
        }
        if (!params.productId)
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

        const product = await prismadb.category.delete({
            where: {
                id: params.productId,
            },
        });

        return Response.json(product);

    } catch (error)
    {
        console.log(`[SIZE_DELETE]`, error);
        return new Response("Internal error", { status: 500 });
    }
}