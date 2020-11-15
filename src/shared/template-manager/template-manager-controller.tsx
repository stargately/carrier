import { useEmailTemplates } from "@/shared/template-manager/hooks/use-email-templates";
import React, { useEffect } from "react";
import Form from "antd/lib/form";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import { useUpsertEmailTemplate } from "@/shared/template-manager/hooks/use-upsert-email-template";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import TextArea from "antd/lib/input/TextArea";
import notification from "antd/lib/notification";
import Row from "antd/lib/grid/row";
import Col from "antd/lib/grid/col";
import { CommonMargin } from "../common/common-margin";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export const TemplateManagerController: React.FC = () => {
  const { templates, html } = useEmailTemplates();
  const template = templates ? templates[0] : {};

  const { upsertEmailTemplate } = useUpsertEmailTemplate();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(template);
  }, [templates]);

  const onFinish = async () => {
    const resp = await upsertEmailTemplate({
      variables: form.getFieldsValue(),
    });
    notification.success({ message: "updated!" });
    form.setFieldsValue(resp?.data?.upsertEmailTemplate || template);
  };

  return (
    <ContentPadding>
      <CommonMargin />

      <h1>Template Manager</h1>

      <Row gutter={8}>
        <Col span={12}>
          <Form {...layout} onFinish={onFinish} form={form}>
            <Form.Item
              name="id"
              label="id"
              hidden={true}
              rules={[{ required: true }]}
            >
              <Input />
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
        </Col>
        <Col span={12}>
          <div dangerouslySetInnerHTML={{ __html: html || "" }} />
        </Col>
      </Row>
    </ContentPadding>
  );
};
