import React from "react";
import { useRenderHtml } from "@/shared/template-manager/hooks/use-render-html";

type Props = { templateId: string };

export const exampleDataPayload = {
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
};

export const EmailPreview: React.FC<Props> = ({ templateId }) => {
  const { html } = useRenderHtml({ ...exampleDataPayload, templateId });

  return (
    <>
      <h2>Preview</h2>
      <div dangerouslySetInnerHTML={{ __html: html || "" }} />
    </>
  );
};
