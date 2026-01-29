"use client";

import { Form, DatePicker, InputNumber, Button, message, Card } from "antd";

export default function ClassTodayForm() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classDate: values.classDate.toISOString(),
        day: values.classDate.format("dddd"),
        noOfClasses: values.noOfClasses,
      }),
    });

    if (!res.ok) {
      message.error("Failed to save class");
      return;
    }

    message.success("Class saved");
    form.resetFields();
  };

  return (
    <div className="p-6 mx-auto max-w-2xl">
      <Card title="Create Class" className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="classDate"
            label="Class Date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="noOfClasses"
            label="No of Classes"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className="!w-full" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Card>
    </div>
  );
}
