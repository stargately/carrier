import { gql } from "@apollo/client/core";

export const emailTemplates = gql`
  query EmailTemplates {
    emailTemplates {
      id
      description
      fromEmail
      replyToEmail
      subject
      plainTextBody
      mainContent
      mainCta
      secondaryContent
      secondaryCta
    }
  }
`;

export const renderHtml = gql`
  query RenderHtml($templateId: String!, $payload: JSONObject) {
    renderHtml(templateId: $templateId, payload: $payload)
  }
`;

export const exampleDataPayload = gql`
  query ExampleDataPayload($templateId: ID!) {
    exampleDataPayload(templateId: $templateId)
  }
`;

export const emailMetaTemplates = gql`
  query EmailMetaTemplates($userId: ID!) {
    emailMetaTemplates(userId: $userId) {
      logoUrl
    }
  }
`;
