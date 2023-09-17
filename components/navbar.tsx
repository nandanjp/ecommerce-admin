import { UserButton, auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <nav className="flex flex-row justify-between items-center px-6 py-4 w-full inset-0 h-16">
      <StoreSwitcher items={stores} />
      <MainNav className="mx-6" />
      <div className="flex flex-row justify-evenly items-center gap-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Navbar;
