// "use client";

// import {
//   Layout,
//   Menu,
//   Card,
//   Row,
//   Col,
//   Statistic,
//   Table,
//   Tag,
//   Progress,
//   Typography,
//   Button,
//   message,
// } from "antd";
// import {
//   LayoutDashboard,
//   Users,
//   CheckCircle,
//   XCircle,
//   Activity,
//   FileText,
//   Download,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// interface UserEntry {
//   key: number;
//   id: number;
//   name: string | null;
//   email: string;
//   role: string;
// }
// interface Attendance {
//   id: number;
//   date: string;
//   subject: string;
//   status: "Present" | "Absent";
// }

// const { Header, Content, Sider } = Layout;
// const { Title, Text } = Typography;

// export default function Home() {
//   const router = useRouter();
//   const [activeKey, setActiveKey] = useState("dashboard");

//   const [users, setUsers] = useState<UserEntry[]>([]);
//   const [attendance, setAttendance] = useState<Attendance[]>([]);
//   const today = new Date().toDateString();
//   const todayRecords = attendance.filter(
//     (a) => new Date(a.date).toDateString() === today,
//   );
//   const presentToday = todayRecords.filter(
//     (a) => a.status === "Present",
//   ).length;

//   const absentToday = todayRecords.filter((a) => a.status === "Absent").length;

//   const attendanceRate =
//     todayRecords.length > 0
//       ? Math.round((presentToday / todayRecords.length) * 100)
//       : 0;

//   const stats = {
//     totalUsers: users.length,
//     presentToday,
//     absentToday,
//     attendanceRate,
//   };

//   const attendancePie = [
//     { name: "Present", value: presentToday },
//     { name: "Absent", value: absentToday },
//   ];

//   const weeklyData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
//     (day, index) => {
//       const dayRecords = attendance.filter(
//         (a) => new Date(a.date).getDay() === index,
//       );
//       return {
//         day,
//         present: dayRecords.filter((a) => a.status === "Present").length,
//       };
//     },
//   );

//   const COLORS = ["#22c55e", "#ef4444"];

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       const res = await fetch("/api/attendance");
//       const data = await res.json();
//       setAttendance(data);
//     };
//     fetchAttendance();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch("/api/users");
//         if (!res.ok) throw new Error("Failed to fetch users");
//         const data = await res.json();
//         const formatted: UserEntry[] = data?.map(
//           (user: any, index: number) => ({
//             key: index + 1,
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//           }),
//         );
//         setUsers(formatted);
//       } catch (err) {
//         console.error(err);
//         message.error("Could not load users data");
//       }
//     };

//     fetchUsers();
//   }, [activeKey]);

//   const columns = [
//     { title: "Name", dataIndex: "name" },
//     { title: "Course", dataIndex: "course" },
//     { title: "Subject", dataIndex: "subject" },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status: string) => (
//         <Tag color={status === "Present" ? "green" : "red"}>{status}</Tag>
//       ),
//     },
//     { title: "Time", dataIndex: "time" },
//   ];

//   const data = attendance.map((a, i) => ({
//     key: i + 1,
//     name: "—",
//     course: "—",
//     subject: a.subject,
//     status: a.status,
//     time: new Date(a.date).toLocaleTimeString(),
//   }));

//   return (
//     <Layout className="min-h-screen bg-slate-50">
//       <Sider width={240} className="!bg-white">
//         <div className="h-16 flex items-center justify-center font-bold text-lg">
//           SmartAttend
//         </div>
//         <Menu
//           mode="inline"
//           // defaultSelectedKeys={["dashboard"]}
//           selectedKeys={[activeKey]}
//           // onClick={({ key }) => setActiveKey(key)}
//           onClick={({ key }) => {
//             setActiveKey(key);
//             if (key === "dashboard") {
//               router.push(`/dashboard-admin`);
//               return;
//             }
//             router.push(`/dashboard-admin/${key}`);
//           }}
//           items={[
//             { key: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
//             { key: "users", icon: <Users />, label: "Users" },
//             { key: "classes", icon: <Users />, label: "Classes" },
//             { key: "course-stats", icon: <Users />, label: "Course Stats" },

//             // { key: "reports", icon: <FileText />, label: "Reports" },
//           ]}
//         />
//       </Sider>

//       <Layout>
//         {/* Header */}
//         <Header className="bg-white shadow-sm flex items-center justify-between px-6">
//           <Title level={4} className="!mb-0">
//             Admin Dashboard
//           </Title>
//           <div className="space-x-2">
//             <Button icon={<Download />} type="default" size="large">
//               Export Excel
//             </Button>
//             <Button icon={<Download />} type="primary" size="large">
//               Export PDF
//             </Button>
//           </div>
//         </Header>

//         <Content className="p-6">
//           <Row gutter={[16, 16]}>
//             <Col xs={24} md={6}>
//               <Card className="rounded-xl">
//                 <Statistic
//                   title="Total Users"
//                   value={stats.totalUsers}
//                   prefix={<Users />}
//                 />
//               </Card>
//             </Col>
//             <Col xs={24} md={6}>
//               <Card className="rounded-xl">
//                 <Statistic
//                   title="Present Today"
//                   value={stats.presentToday}
//                   valueStyle={{ color: "#16a34a" }}
//                   prefix={<CheckCircle />}
//                 />
//               </Card>
//             </Col>
//             <Col xs={24} md={6}>
//               <Card className="rounded-xl">
//                 <Statistic
//                   title="Absent Today"
//                   value={stats.absentToday}
//                   valueStyle={{ color: "#dc2626" }}
//                   prefix={<XCircle />}
//                 />
//               </Card>
//             </Col>
//             <Col xs={24} md={6}>
//               <Card className="rounded-xl">
//                 <Statistic
//                   title="Attendance Rate"
//                   value={`${stats.attendanceRate}%`}
//                   prefix={<Activity />}
//                 />
//                 <Progress percent={stats.attendanceRate} showInfo={false} />
//               </Card>
//             </Col>
//           </Row>

//           <Row gutter={[16, 16]} className="mt-6">
//             <Col xs={24} md={12}>
//               <Card
//                 title="Today Attendance Distribution"
//                 className="rounded-xl"
//               >
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={attendancePie}
//                       dataKey="value"
//                       nameKey="name"
//                       innerRadius={60}
//                       outerRadius={90}
//                     >
//                       {attendancePie.map((_, index) => (
//                         <Cell key={index} fill={COLORS[index]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Col>

//             <Col xs={24} md={12}>
//               <Card title="Weekly Attendance Trend" className="rounded-xl">
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={weeklyData}>
//                     <XAxis dataKey="day" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="present" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Card>
//             </Col>
//           </Row>

//           <Card title="Live Attendance" className="rounded-xl mt-6">
//             <Table
//               columns={columns}
//               dataSource={data}
//               pagination={{ pageSize: 5 }}
//             />
//           </Card>

//           <Text className="block text-center text-slate-400 mt-8">
//             Smart Attendance System © 2026
//           </Text>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

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
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface UserEntry {
  key: number;
  id: number;
  name: string | null;
  email: string;
  role: string;
}

interface Attendance {
  id: number;
  date: string;
  subject: string;
  status: "Present" | "Absent";
}

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("dashboard");

  const [users, setUsers] = useState<UserEntry[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  const today = new Date().toDateString();
  const todayRecords = attendance.filter(
    (a) => new Date(a.date).toDateString() === today,
  );
  const presentToday = todayRecords.filter(
    (a) => a.status === "Present",
  ).length;
  const absentToday = todayRecords.filter((a) => a.status === "Absent").length;

  const attendanceRate =
    todayRecords.length > 0
      ? Math.round((presentToday / todayRecords.length) * 100)
      : 0;

  const stats = {
    totalUsers: users.length,
    presentToday,
    absentToday,
    attendanceRate,
  };

  const attendancePie = [
    { name: "Present", value: presentToday },
    { name: "Absent", value: absentToday },
  ];

  const weeklyData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (day, index) => {
      const dayRecords = attendance.filter(
        (a) => new Date(a.date).getDay() === index,
      );
      return {
        day,
        present: dayRecords.filter((a) => a.status === "Present").length,
      };
    },
  );

  const COLORS = ["#22c55e", "#ef4444"];

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      setAttendance(data);
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
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

  // Prepare table data (same as displayed)
  const tableData = attendance.map((a, i) => ({
    key: i + 1,
    name: "—",
    course: "—",
    subject: a.subject,
    status: a.status,
    time: new Date(a.date).toLocaleTimeString(),
  }));

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Course", dataIndex: "course", key: "course" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Present" ? "green" : "red"}>{status}</Tag>
      ),
    },
    { title: "Time", dataIndex: "time", key: "time" },
  ];

  // Export to Excel (.xlsx)
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

      // Optional: set column widths
      worksheet["!cols"] = [
        { wch: 20 }, // Name
        { wch: 15 }, // Course
        { wch: 20 }, // Subject
        { wch: 12 }, // Status
        { wch: 18 }, // Time
      ];

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(
        dataBlob,
        `Attendance_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      message.success("Excel file exported successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to export Excel");
    }
  };

  // Export to PDF using jsPDF + autoTable
  const exportToPDF = () => {
    try {
      const doc = new jsPDF("landscape");

      doc.setFontSize(16);
      doc.text("Attendance Report", 14, 20);

      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

      autoTable(doc, {
        startY: 38,
        head: [["Name", "Course", "Subject", "Status", "Time"]],
        body: tableData.map((row) => [
          row.name,
          row.course,
          row.subject,
          row.status,
          row.time,
        ]),
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [66, 139, 202] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 40 },
          2: { cellWidth: 60 },
          3: { cellWidth: 30 },
          4: { cellWidth: 50 },
        },
      });

      doc.save(`Attendance_${new Date().toISOString().split("T")[0]}.pdf`);
      message.success("PDF exported successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to export PDF");
    }
  };

  return (
    <Layout className="min-h-screen bg-slate-50">
      <Sider width={240} className="!bg-white">
        <div className="h-16 flex items-center justify-center font-bold text-lg">
          SmartAttend
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
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
            { key: "classes", icon: <Users />, label: "Classes" },
            { key: "course-stats", icon: <Users />, label: "Course Stats" },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm flex items-center justify-between px-6">
          <Title level={4} className="!mb-0">
            Admin Dashboard
          </Title>
          <div className="space-x-2">
            <Button
              icon={<Download />}
              type="default"
              size="large"
              onClick={exportToExcel}
            >
              Export Excel
            </Button>
            <Button
              icon={<Download />}
              type="primary"
              size="large"
              onClick={exportToPDF}
            >
              Export PDF
            </Button>
          </div>
        </Header>

        <Content className="p-6">
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
                    <Bar dataKey="present" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card title="Live Attendance" className="rounded-xl mt-6">
            <Table
              columns={columns}
              dataSource={tableData}
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
