import Form from "antd/lib/form";
import Input from "antd/lib/input";
import TextArea from "antd/lib/input/TextArea";
import Button from "antd/lib/button";
import React, { useEffect } from "react";
import notification from "antd/lib/notification";
import { useUpsertEmailTemplate } from "@/shared/template-manager/hooks/use-upsert-email-template";
// eslint-disable-next-line camelcase
import { EmailTemplates_emailTemplates } from "@/shared/template-manager/data/__generated__/EmailTemplates";
import {
  emailTemplates,
  exampleDataPayload,
  renderHtml,
} from "@/shared/template-manager/data/queries";
import { getOperationName } from "@apollo/client/utilities";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

type Props = {
  // eslint-disable-next-line camelcase
  template?: EmailTemplates_emailTemplates;
  setTemplateId?: (id: string) => void;
};

// eslint-disable-next-line camelcase
export const EmailTemplateFormController: React.FC<Props> = ({
  setTemplateId,
  template,
}) => {
  const { upsertEmailTemplate } = useUpsertEmailTemplate();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const variables = form.getFieldsValue();
    const resp = await upsertEmailTemplate({
      variables,
      refetchQueries: [
        // @ts-ignore
        getOperationName(exampleDataPayload),
        // @ts-ignore
        getOperationName(renderHtml),
        // @ts-ignore
        getOperationName(emailTemplates),
      ],
    });
    notification.success({ message: "updated!" });
    form.setFieldsValue(resp?.data?.upsertEmailTemplate || template);
    if (setTemplateId) {
      setTemplateId(variables.id);
    }
  };
  useEffect(() => {
    form.setFieldsValue(template);
  }, [template]);

  return (
    <Form {...layout} onFinish={onFinish} form={form}>
      <h2>{template ? "Update " : "Create "}Email Template</h2>
      <Form.Item name="id" label="id" rules={[{ required: true }]}>
        <Input disabled={Boolean(template?.id)} />
      </Form.Item>
      <Form.Item
        name="description"
        label="description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="fromEmail" label="fromEmail">
        <Input />
      </Form.Item>
      <Form.Item name="replyToEmail" label="replyToEmail">
        <Input />
      </Form.Item>
      <Form.Item name="subject" label="subject">
        <Input />
      </Form.Item>
      <Form.Item name="plainTextBody" label="plainTextBody">
        <Input />
      </Form.Item>
      <Form.Item name="mainContent" label="mainContent">
        <TextArea rows={10} />
      </Form.Item>
      <Form.Item name="mainCta" label="mainCta">
        <Input />
      </Form.Item>
      <Form.Item name="secondaryContent" label="secondaryContent">
        <TextArea rows={10} />
      </Form.Item>
      <Form.Item name="secondaryCta" label="secondaryCta">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
