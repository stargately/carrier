import { useQuery } from "@apollo/client";
import { emailTemplates } from "@/shared/template-manager/data/queries";
import { EmailTemplates } from "../data/__generated__/EmailTemplates";

export const useEmailTemplates = () => {
  const { data, loading } = useQuery<EmailTemplates>(emailTemplates, {
    ssr: false,
  });

  return {
    templates: data?.emailTemplates,
    loading,
  };
};
