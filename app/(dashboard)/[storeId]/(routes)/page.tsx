import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign } from "lucide-react";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { storeId } = params;

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  const graphData = [
    { name: "Jan", total: 123 },
    { name: "Feb", total: 123 },
    { name: "Mar", total: 434 },
    { name: "Apr", total: 243 },
    { name: "May", total: 12 },
    { name: "Jun", total: 1 },
    { name: "Jul", total: 2 },
    { name: "Aug", total: 3 },
    { name: "Sep", total: 343 },
    { name: "Oct", total: 435 },
    { name: "Nov", total: 121 },
    { name: "Dec", total: 123 },
  ];

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title="Active Store" description={`${store?.name}`} />
          <Separator />
          <Heading title="Dashboard" description="Overview of your store" />
          <Separator />
          <div className="grid gap-4 grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {formatter.format(1234567)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                <div className="text-2xl font-bold">22313213</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products In Stock
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                <div className="text-2xl font-bold">80123213</div>
              </CardContent>
            </Card>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={graphData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
