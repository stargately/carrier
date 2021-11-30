import React, { useEffect, useState } from "react";
import { useApiTokens } from "@/shared/api-tokens/view/hooks/use-api-tokens";
import Form from "antd/lib/form";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import { useUpsertApiTokens } from "@/shared/api-tokens/view/hooks/use-upsert-api-tokens";
import notification from "antd/lib/notification";
import { ColorPicker } from "@/shared/common/components/color-picker";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const ApiTokensController = (): JSX.Element => {
  const { data } = useApiTokens();
  const { mutate } = useUpsertApiTokens();
  const onFinish = async (values: Record<string, unknown>) => {
    await mutate({ variables: values });
    notification.success({ message: "updated!" });
  };

  const [color, setColor] = useState("#33A68F");

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(data?.apiTokens);
    setColor(data?.apiTokens?.themeColor || "#33A68F");
  }, [data?.apiTokens]);

  return (
    <Form {...layout} form={form} name="basic" onFinish={onFinish}>
      <Form.Item hidden={true} name="_id">
        <Input />
      </Form.Item>

      <Form.Item
        label="sendgridApiKey"
        name="sendgridApiKey"
        rules={[
          { required: true, message: "Please input your sendgrid API key!" },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="carrierToken"
        name="carrierToken"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="themeColor" name="themeColor">
        <ColorPicker color={color} onChange={setColor} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
