"use client";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="flex flex-col items-center py-6 px-12">
      <div className="p-4 flex justify-between w-full">
        <Button variant="outline" size="default">
          Click me
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
      Root Page
    </div>
  );
};

export default SetupPage;
