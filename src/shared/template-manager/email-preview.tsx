import React from "react";
import { useRenderHtml } from "@/shared/template-manager/hooks/use-render-html";
import Form from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import Card from "antd/lib/card";
import { CommonMargin } from "@/shared/common/common-margin";
import notification from "antd/lib/notification";
import Button from "antd/lib/button";
import { useExampleDataPayload } from "@/shared/template-manager/hooks/use-example-data-payload";
import { useUpdateExampleDataPayload } from "@/shared/template-manager/hooks/use-update-email-data-payload";
import Input from "antd/lib/input/Input";
import Skeleton from "react-loading-skeleton";

type Props = { templateId: string };

export const EmailPreview: React.FC<Props> = ({ templateId }) => {
  const { exampleDataPayload, loading } = useExampleDataPayload(templateId);
  const { updateExampleDataPayload } = useUpdateExampleDataPayload();

  const { html } = useRenderHtml({
    payload: exampleDataPayload || {},
    templateId,
  });

  return (
    <>
      <Card>
        <h2>Example Data Payload</h2>
        {loading ? (
          <Skeleton />
        ) : (
          <Form
            layout="vertical"
            onFinish={(val) => {
              try {
                const payload = JSON.parse(val.exampleDataPayload);
                updateExampleDataPayload({
                  templateId: val.templateId,
                  exampleDataPayload: payload,
                });
                notification.success({ message: "Updated!" });
              } catch (err) {
                notification.error({ message: err });
              }
            }}
          >
            <Form.Item
              name="templateId"
              hidden={true}
              initialValue={templateId}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="JSON Payload"
              name="exampleDataPayload"
              initialValue={JSON.stringify(exampleDataPayload || {}, null, 2)}
            >
              <TextArea
                style={{ fontFamily: "monospace, monospace" }}
                rows={10}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Re-render</Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      <CommonMargin />

      <Card>
        <h2>Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: html || "" }} />
      </Card>
    </>
  );
};
