import { useMutation } from "@apollo/client";
import { UpdateExampleDataPayload } from "@/shared/template-manager/data/__generated__/UpdateExampleDataPayload";
import { updateExampleDataPayload } from "@/shared/template-manager/data/mutations";
import { exampleDataPayload } from "@/shared/template-manager/data/queries";

export const useUpdateExampleDataPayload = () => {
  const [mutate, { data, loading }] = useMutation<UpdateExampleDataPayload>(
    updateExampleDataPayload
  );
  return {
    updateExampleDataPayload(vals: {
      templateId: string;
      exampleDataPayload: Record<string, unknown>;
    }) {
      mutate({
        variables: vals,
        refetchQueries: [
          {
            query: exampleDataPayload,
            variables: {
              templateId: vals.templateId,
            },
          },
        ],
      });
    },
    data,
    loading,
  };
};
