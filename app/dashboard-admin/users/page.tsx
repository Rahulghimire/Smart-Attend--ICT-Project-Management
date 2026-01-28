"use client";

import { Card, Form, Input, Select, Button, message } from "antd";

export default function CreateUserPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.error || "Failed to create user");
        return;
      }

      message.success("User created successfully");
      form.resetFields();
    } catch {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-200">
      <Card title="Create User" className="shadow-sm">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Full Name" name="name">
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item label="Role" name="role" initialValue="user">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create User
          </Button>
        </Form>
      </Card>
    </div>
  );
}
