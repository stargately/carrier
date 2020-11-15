import { gql } from "@apollo/client/core";

export const upsertEmailTemplate = gql`
  mutation UpsertEmailTemplate(
    $id: String!
    $description: String!
    $fromEmail: String
    $replyToEmail: String
    $subject: String
    $mainContent: String
    $mainCta: String
    $secondaryContent: String
    $secondaryCta: String
  ) {
    upsertEmailTemplate(
      id: $id
      description: $description
      fromEmail: $fromEmail
      replyToEmail: $replyToEmail
      subject: $subject
      mainContent: $mainContent
      mainCta: $mainCta
      secondaryContent: $secondaryContent
      secondaryCta: $secondaryCta
    ) {
      id
      description
    }
  }
`;
