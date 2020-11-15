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
  query RenderHtml(
    $templateId: String!
    $email: String!
    $idempotencyKey: String!
    $payload: JSONObject
  ) {
    renderHtml(
      templateId: $templateId
      email: $email
      idempotencyKey: $idempotencyKey
      payload: $payload
    )
  }
`;
