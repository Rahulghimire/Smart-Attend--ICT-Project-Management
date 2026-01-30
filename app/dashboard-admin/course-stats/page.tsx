"use client";

import { Form, Input, InputNumber, Button, message, Card } from "antd";

export default function CourseStatsForm() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const res = await fetch("/api/course-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: values.course,
          totalStudents: values.totalStudents,
        }),
      });

      if (!res.ok) {
        message.error("Failed to save course stats");
        return;
      }

      message.success("Course stats saved");
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("An error occurred");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-xl">
      <Card title="Add Course Stats" className="shadow-sm">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="course"
            label="Course Name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input placeholder="e.g. Computer Science" />
          </Form.Item>

          <Form.Item
            name="totalStudents"
            label="Total Students"
            rules={[{ required: true, message: "Please enter total students" }]}
          >
            <InputNumber min={0} className="!w-full" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Card>
    </div>
  );
}
