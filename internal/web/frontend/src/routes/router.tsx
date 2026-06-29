import { Route, Routes } from "react-router";
import Home from "@/pages/home";
import Students from "@/pages/students";
import StudentDetails from "@/pages/student-details";
import NotFound from "@/pages/not-found";
import AppLayout from "@/layouts/app-layout";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}