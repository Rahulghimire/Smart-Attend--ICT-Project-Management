"use client";
import { message, Form, Input, Button } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function Home() {

  const [loading, setLoading] = useState(false);
  // const router = useRouter();
    const router = useRouter();



  const onFinish = (values: any) => {
    setLoading(true);
    const { email, password } = values;

  setTimeout(() => {
      setLoading(false);
      if (email === "test@example.com" && password === "123456") {
        message.success(`Logged in as ${email}`);
        router.push("/user"); 
      } else {
        message.error("Invalid email or password");
      }
    }, 1000);
  };


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Form
        name="login"
        onFinish={onFinish}
        style={{
          width: 300,
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        layout="vertical"
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Enter a valid email!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
