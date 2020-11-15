import { useMutation } from "@apollo/client";
import { upsertEmailTemplate } from "@/shared/template-manager/data/mutations";
import { UpsertEmailTemplate } from "@/shared/template-manager/data/__generated__/UpsertEmailTemplate";

export const useUpsertEmailTemplate = () => {
  const [mutate, { data, loading }] = useMutation<UpsertEmailTemplate>(
    upsertEmailTemplate
  );
  return {
    upsertEmailTemplate: mutate,
    data,
    loading,
  };
};
