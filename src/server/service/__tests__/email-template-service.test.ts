import test from "ava";
import fs from "fs";
import {
  buildMjml,
  formatString,
  parseCta,
  wrapMjmlLines,
} from "@/server/service/email-template-service";
import {
  testBlock,
  testBlockMjml,
  testDataPayload,
  testHydrated,
} from "@/server/service/__tests__/email-template-test-data";
import mjml2html from "mjml";

test("lines to wrapped html", async (t) => {
  const hydrated = formatString(testBlock, testDataPayload);
  t.deepEqual(hydrated, testHydrated);
  const wrapped = wrapMjmlLines(hydrated);
  t.deepEqual(wrapped, testBlockMjml);
});

test("build template", async (t) => {
  const dataPayload = {
    subject: "New Meeting Request",
    meetingUrl: "https://daommo.com/meeting/123",
    recipient: "Thom Friedmanm",
    dateTime: "Aug 2, 2020, Thursday, 2pm - 3pm Pacific Time",
    sender: "David Fink",
    senderCompany: "Fantastic Company",
  };

  const template = {
    subject: "New Meeting Request",
    mainContent: testHydrated,
    mainCta: `[Join Meeting](https://example.com)`,
    secondaryContent: `Best,<br/>\${sender}<br/>\${senderCompany}`,
    secondaryCta: "",
  };

  const mjml = buildMjml(template, dataPayload);

  fs.writeFileSync(`${__dirname}/output-template.mjml`, mjml);
  t.truthy(mjml);

  fs.writeFileSync(`${__dirname}/output-template.html`, mjml2html(mjml).html);
});

test("parseCta", async (t) => {
  const cta = parseCta(`[Join Meeting](https://example.com)`);
  t.deepEqual(cta, {
    content: "Join Meeting",
    href: "https://example.com",
  });
});
