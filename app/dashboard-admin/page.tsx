"use client";

import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Typography,
  Button,
  message,
} from "antd";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserEntry {
  key: number;
  id: number;
  name: string | null;
  email: string;
  role: string;
}

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("dashboard");

  const [users, setUsers] = useState<UserEntry[]>([]);

  const stats = {
    totalUsers: users?.length,
    presentToday: 96,
    absentToday: 24,
    attendanceRate: 80,
  };

  const attendancePie = [
    { name: "Present", value: stats.presentToday },
    { name: "Absent", value: stats.absentToday },
  ];

  const weeklyData = [
    { day: "Mon", present: 92 },
    { day: "Tue", present: 95 },
    { day: "Wed", present: 90 },
    { day: "Thu", present: 98 },
    { day: "Fri", present: 96 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  useEffect(() => {
    if (activeKey !== "users") return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const formatted: UserEntry[] = data?.map(
          (user: any, index: number) => ({
            key: index + 1,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }),
        );
        setUsers(formatted);
      } catch (err) {
        console.error(err);
        message.error("Could not load users data");
      }
    };

    fetchUsers();
  }, [activeKey]);

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Course", dataIndex: "course" },
    { title: "Subject", dataIndex: "subject" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Present" ? "green" : "red"}>{status}</Tag>
      ),
    },
    { title: "Time", dataIndex: "time" },
  ];

  const data = [
    {
      key: 1,
      name: "John Doe",
      course: "MPIT",
      subject: "ITC556",
      status: "Present",
      time: "09:02 AM",
    },
    {
      key: 2,
      name: "Jane Smith",
      course: "MBA",
      subject: "HR401",
      status: "Absent",
      time: "—",
    },
  ];

  return (
    <Layout className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sider width={240} className="!bg-white">
        <div className="h-16 flex items-center justify-center font-bold text-lg">
          SmartAttend
        </div>
        <Menu
          mode="inline"
          // defaultSelectedKeys={["dashboard"]}
          selectedKeys={[activeKey]}
          // onClick={({ key }) => setActiveKey(key)}
          onClick={({ key }) => {
            setActiveKey(key);
            if (key === "dashboard") {
              router.push(`/dashboard-admin`);
              return;
            }
            router.push(`/dashboard-admin/${key}`);
          }}
          items={[
            { key: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
            { key: "users", icon: <Users />, label: "Users" },
            // { key: "reports", icon: <FileText />, label: "Reports" },
          ]}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="bg-white shadow-sm flex items-center justify-between px-6">
          <Title level={4} className="!mb-0">
            Admin Dashboard
          </Title>
          <div className="space-x-2">
            <Button icon={<Download />} type="default">
              Export Excel
            </Button>
            <Button icon={<Download />} type="primary">
              Export PDF
            </Button>
          </div>
        </Header>

        <Content className="p-6">
          {/* KPI Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={6}>
              <Card className="rounded-xl">
                <Statistic
                  title="Total Users"
                  value={stats.totalUsers}
                  prefix={<Users />}
                />
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card className="rounded-xl">
                <Statistic
                  title="Present Today"
                  value={stats.presentToday}
                  valueStyle={{ color: "#16a34a" }}
                  prefix={<CheckCircle />}
                />
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card className="rounded-xl">
                <Statistic
                  title="Absent Today"
                  value={stats.absentToday}
                  valueStyle={{ color: "#dc2626" }}
                  prefix={<XCircle />}
                />
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card className="rounded-xl">
                <Statistic
                  title="Attendance Rate"
                  value={`${stats.attendanceRate}%`}
                  prefix={<Activity />}
                />
                <Progress percent={stats.attendanceRate} showInfo={false} />
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24} md={12}>
              <Card
                title="Today Attendance Distribution"
                className="rounded-xl"
              >
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={attendancePie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                    >
                      {attendancePie.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Weekly Attendance Trend" className="rounded-xl">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Table */}
          <Card title="Live Attendance" className="rounded-xl mt-6">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
            />
          </Card>

          <Text className="block text-center text-slate-400 mt-8">
            Smart Attendance System © 2026
          </Text>
        </Content>
      </Layout>
    </Layout>
  );
}
