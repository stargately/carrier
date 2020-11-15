export const testBlock = `Dear \${recipient},

We would like to invite you to join our \${meetingName} meeting. Details of the meeting are listed below:

<strong style="font-size: 14px; color: #999; line-height: 18px">Date and Time:</strong><br /> \${dateTime}

We look forward to speaking with you soon!
`;

export const testDataPayload = {
  meetingUrl: "https://daommo.com/meeting/123",
  recipient: "Thom Friedmanm",
  meetingName: "our 2020 Q2 investor group",
  dateTime: "Aug 2, 2020, Thursday, 2pm - 3pm Pacific Time",
  sender: "David Fink",
  senderCompany: "Fantastic Company",
};

export const testHydrated = `Dear Thom Friedmanm,

We would like to invite you to join our our 2020 Q2 investor group meeting. Details of the meeting are listed below:

<strong style="font-size: 14px; color: #999; line-height: 18px">Date and Time:</strong><br /> Aug 2, 2020, Thursday, 2pm - 3pm Pacific Time

We look forward to speaking with you soon!
`;

export const testBlockMjml = `
    <mj-section padding-bottom="0px">
      <mj-column>
        <mj-text>
          <p>
          Dear Thom Friedmanm,
          </p>
        </mj-text>
      </mj-column>
    </mj-section>



    <mj-section padding-bottom="0px">
      <mj-column>
        <mj-text>
          <p>
          We would like to invite you to join our our 2020 Q2 investor group meeting. Details of the meeting are listed below:
          </p>
        </mj-text>
      </mj-column>
    </mj-section>



    <mj-section padding-bottom="0px">
      <mj-column>
        <mj-text>
          <p>
          <strong style="font-size: 14px; color: #999; line-height: 18px">Date and Time:</strong><br /> Aug 2, 2020, Thursday, 2pm - 3pm Pacific Time
          </p>
        </mj-text>
      </mj-column>
    </mj-section>



    <mj-section padding-bottom="0px">
      <mj-column>
        <mj-text>
          <p>
          We look forward to speaking with you soon!

          </p>
        </mj-text>
      </mj-column>
    </mj-section>
`;
