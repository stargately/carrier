import React from "react";
import { Avatar } from "@/shared/common/upload";
import { useEmailMetaTemplates } from "@/shared/template-manager/hooks/use-email-meta-templates";
import { useSelector } from "react-redux";

export const LogoController: React.FC = () => {
  const userId = useSelector<{ base: { userId: string } }, string>(
    (state) => state.base.userId
  );

  const { logoUrl, loading } = useEmailMetaTemplates(userId);
  return <Avatar isLoading={loading} initialImageUrl={logoUrl} />;
};
