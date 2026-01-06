// "use client";

// import { Button, Card, List, Typography, Divider, Form, Input, message, Select } from "antd";
// import router from "next/router";
// import { useState } from "react";
// const { Title } = Typography;
// const { Option } = Select;

// export default function Home() {
//   const [loading, setLoading] = useState(false);

//   const features = [
//     "Student attendance history",
//     "Notifications / alerts for check-in & check-out",
//   ];

//   const subjects = [
//     { code: "CS101", name: "Computer Science" },
//     { code: "MATH201", name: "Mathematics" },
//     { code: "PHY301", name: "Physics" },
//   ];

//   const courses = ["B.Tech", "M.Sc", "MBA"];

//   const onFinish = (values: any) => {
//     setLoading(true);
//     const { email, subject, course } = values;

//     setTimeout(() => {
//       setLoading(false);
//       if (email === "test@example.com") {
//         message.success(`Logged in as ${email}\nSubject: ${subject}\nCourse: ${course}`);
//         router.push("/user");
//       } else {
//         message.error("Invalid email or password");
//       }
//     }, 1000);
//   };

//   return (
//     <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
//       <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
//         User Dashboard
//       </Title>

//       <Card style={{ marginBottom: 20, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//         <Title level={4}>Features</Title>
//         <List
//           dataSource={features}
//           renderItem={(item) => <List.Item>{item}</List.Item>}
//         />
//       </Card>

//       <Divider />

//       <Card
//         style={{
//           textAlign: "center",
//           borderRadius: 12,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Form
//           name="login"
//           onFinish={onFinish}
//           layout="vertical"
//           style={{ maxWidth: 400, margin: "0 auto" }}
//         >
//           <h2 style={{ textAlign: "center", marginBottom: 24 }}>Take Attendance</h2>

//           <Form.Item
//             label="Select Course"
//             name="course"
//             rules={[{ required: true, message: "Please select a course!" }]}
//           >
//             <Select placeholder="Select Course">
//               {courses.map((course) => (
//                 <Option key={course} value={course}>
//                   {course}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Select Subject + Code"
//             name="subject"
//             rules={[{ required: true, message: "Please select a subject!" }]}
//           >
//             <Select placeholder="Select Subject">
//               {subjects.map((sub) => (
//                 <Option key={sub.code} value={`${sub.code} - ${sub.name}`}>
//                   {sub.code} - {sub.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>


//           <Form.Item>
//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { Layout, Menu, Card, List, Typography,  Form, Select, Button, message, Table } from "antd";
const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("take"); 

  const subjects = [
    { code: "CS101", name: "Computer Science" },
    { code: "MATH201", name: "Mathematics" },
    { code: "PHY301", name: "Physics" },
  ];

  const courses = ["B.Tech", "M.Sc", "MBA"];

  const attendanceData = [
    { key: 1, date: "2026-01-01", subject: "CS101 - Computer Science", status: "Present" },
    { key: 2, date: "2026-01-02", subject: "MATH201 - Mathematics", status: "Absent" },
    { key: 3, date: "2026-01-03", subject: "PHY301 - Physics", status: "Present" },
  ];

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(
        `Attendance recorded for ${values.subject} (${values.course})`
      );
    }, 1000);
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: "#001529" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[activeTab]}
          onClick={(e) => setActiveTab(e.key)}
        >
          <Menu.Item key="take">Take Attendance</Menu.Item>
          <Menu.Item key="history">Attendance History</Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" }}>
        {activeTab === "take" && (
          <Card
            style={{
              textAlign: "center",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={3}>Take Attendance</Title>
            <Form
              name="attendance"
              onFinish={onFinish}
              layout="vertical"
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              <Form.Item
                label="Select Course"
                name="course"
                rules={[{ required: true, message: "Please select a course!" }]}
              >
                <Select placeholder="Select Course">
                  {courses.map((course) => (
                    <Option key={course} value={course}>
                      {course}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Select Subject + Code"
                name="subject"
                rules={[{ required: true, message: "Please select a subject!" }]}
              >
                <Select placeholder="Select Subject">
                  {subjects.map((sub) => (
                    <Option key={sub.code} value={`${sub.code} - ${sub.name}`}>
                      {sub.code} - {sub.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        {activeTab === "history" && (
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={3} style={{ textAlign: "center" }}>
              Attendance History
            </Title>
            <Table
              columns={columns}
              dataSource={attendanceData}
              pagination={false}
              style={{ marginTop: 20 }}
            />
          </Card>
        )}
      </Content>
    </Layout>
  );
}
