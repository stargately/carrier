import { useQuery } from "@apollo/client";
import { renderHtml } from "@/shared/template-manager/data/queries";
import {
  RenderHtml,
  RenderHtmlVariables,
} from "@/shared/template-manager/data/__generated__/RenderHtml";

export const useRenderHtml = (variables: RenderHtmlVariables) => {
  const { data, loading } = useQuery<RenderHtml>(renderHtml, {
    ssr: false,
    variables,
  });
  return {
    html: data?.renderHtml,
    loading,
  };
};
