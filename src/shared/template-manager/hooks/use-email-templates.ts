import { useQuery } from "@apollo/client";
import { emailTemplates } from "@/shared/template-manager/data/queries";
import { useRenderHtml } from "@/shared/template-manager/hooks/use-render-html";
import { EmailTemplates } from "../data/__generated__/EmailTemplates";

export const useEmailTemplates = () => {
  const { data, loading } = useQuery<EmailTemplates>(emailTemplates, {
    ssr: false,
  });
  const { html } = useRenderHtml({
    templateId: "new_meeting_request",
    email: "puncsky@gmail.com",
    idempotencyKey: "yo",
    payload: {
      meetingUrl: "https://daommo.com/meeting/123",
      recipient: "Thom Friedmanm",
      meetingName: "our 2020 Q2 investor group",
      dateTime: "Aug 2, 2020, Thursday, 2pm - 3pm Pacific Time",
      sender: "David Fink",
      senderCompany: "Fantastic Company",
    },
  });

  return {
    templates: data?.emailTemplates,
    html,
    loading,
  };
};
