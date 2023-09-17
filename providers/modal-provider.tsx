"use client";

import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; //return null for the server-side, so that there is no error when hydrated the client component
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
