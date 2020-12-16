import { useQuery } from "@apollo/client";
import { ExampleDataPayload } from "@/shared/template-manager/data/__generated__/ExampleDataPayload";
import { exampleDataPayload } from "@/shared/template-manager/data/queries";

export const useExampleDataPayload = (templateId: string) => {
  const { data, loading } = useQuery<ExampleDataPayload>(exampleDataPayload, {
    ssr: false,
    variables: {
      templateId,
    },
  });
  return {
    exampleDataPayload: data?.exampleDataPayload,
    loading,
  };
};
