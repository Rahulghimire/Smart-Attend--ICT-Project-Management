"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(data.user));

      message.success(`Welcome back, ${data.user.email.split("@")[0]}!`);

      const redirectPath = data?.user?.role === "admin" ? "/admin" : "/user";

      router.push(redirectPath);
    } catch (err: any) {
      message.error(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4"
      style={{
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(79, 70, 229, 0.08) 0%, transparent 30%)",
      }}
    >
      <Card
        className="w-full max-w-md shadow-2xl border border-gray-200/60 backdrop-blur-sm bg-white/95 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-100/40"
        bordered={false}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-2xl font-bold mb-4 shadow-lg">
            SA
          </div>
          <Title level={3} className="!mb-1 text-gray-800">
            SmartAttend
          </Title>
          <Text type="secondary">Secure • Modern • Reliable</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-gray-700 font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="your.email@domain.com"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700 font-medium">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
              className="rounded-lg h-12"
            />
          </Form.Item>

          <Form.Item className="mb-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="h-12 text-base font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-none shadow-md"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
