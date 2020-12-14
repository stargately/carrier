import { useEmailTemplates } from "@/shared/template-manager/hooks/use-email-templates";
import React, { useState } from "react";
import Row from "antd/lib/grid/row";
import Col from "antd/lib/grid/col";
import Button from "antd/lib/button";
import Select from "antd/lib/select";
import Card from "antd/lib/card";
import { EmailTemplateFormController } from "./email-template-form-controller";
import { CommonMargin } from "../common/common-margin";
import { EmailPreview } from "./email-preview";

export const TemplateManagerController: React.FC = () => {
  const { templates } = useEmailTemplates();
  const [curId, setCurId] = useState("");

  const template = templates?.find((t) => t.id === curId);
  const onChange = (val: string) => {
    setCurId(val);
  };

  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Select
              showSearch
              placeholder="👋 start by selecting a template"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {(templates || []).map((t, i) => (
                <Select.Option key={i} value={t.id}>
                  {t.id}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button>New Template</Button>
          </Col>
        </Row>
      </Card>

      <CommonMargin />

      {template && (
        <Row gutter={8}>
          <Col span={12}>
            <Card>
              <EmailTemplateFormController template={template} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <EmailPreview templateId={curId} />
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};
