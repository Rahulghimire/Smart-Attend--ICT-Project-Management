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
    <div className="p-6 mx-auto max-w-2xl">
      <Card title="Create User" className="shadow-sm">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Course"
            name="course"
            rules={[{ required: true, message: "Course is required" }]}
          >
            <Input placeholder="e.g. MPIT, MBA" />
          </Form.Item>

          <Form.Item
            label="Student ID"
            name="studentId"
            rules={[{ required: true, message: "Student ID is required" }]}
          >
            <Input placeholder="Enter student ID" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Phone number is required" },
              {
                pattern: /^[0-9]{8,15}$/,
                message: "Enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            initialValue="user"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            Create User
          </Button>
        </Form>
      </Card>
    </div>
  );
}
