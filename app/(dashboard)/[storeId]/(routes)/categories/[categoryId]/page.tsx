import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const ProductPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismadb.product.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default ProductPage;
