type Payload = {
  subject: string;
  mainContent: string;
  mainCta: string;
  secondaryContent: string;
  secondaryCta: string;
};

export const getGeneralEmailCanaotes = (payload: Payload): string => `
<mjml lang="en">
  <mj-head>
    <mj-title>${payload.subject}</mj-title>
    <mj-attributes>
      <mj-button border-radius="4px" text-transform="capitalize" font-weight="bold" font-size="14px" line-height="16.41px" background-color="#33A68F" color="#ffffff"></mj-button>
      <mj-all font-size="14px" line-height="16.41px" font-family="Roboto, Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-weight="400" font-size="14px" color="#434245" line-height="16.41px"></mj-text>
      <mj-class font-weight="bold" name="heading" />
      <mj-class color="#999" name="footer-text" font-size="14px" />

    </mj-attributes>
    <mj-style inline="inline">
      h1, h2 { margin: 0; font-size: 18px; line-height: normal; font-weight: bold; } p { margin: 0; } a { color: #2e58ff; text-decoration: none; }
    </mj-style>
    <mj-style>
      a, span, td, th { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }
    </mj-style>
  </mj-head>
  <mj-body background-color="#ffffff">

    <mj-section padding="0px">
      <mj-column>
        <mj-image src="https://dashboard.daommo.com/logo-text.png" alt="logo" align="left" width="128px" style="color: #34699A;" />
      </mj-column>
    </mj-section>

    ${payload.mainContent}

    ${payload.mainCta}

    ${payload.secondaryContent}
  </mj-body>
</mjml>
`;
