import { useQuery } from "@apollo/client";
import { EmailMetaTemplates } from "@/shared/template-manager/data/__generated__/EmailMetaTemplates";
import { emailMetaTemplates } from "@/shared/template-manager/data/queries";

export const useEmailMetaTemplates = (userId: string) => {
  const { data, loading } = useQuery<EmailMetaTemplates>(emailMetaTemplates, {
    ssr: false,
    variables: {
      userId,
    },
  });
  return {
    logoUrl: data?.emailMetaTemplates.logoUrl || "",
    loading,
  };
};
