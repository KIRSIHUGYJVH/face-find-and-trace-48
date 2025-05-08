
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserReports from "./UserReports";
import ReportLost from "./ReportLost";
import FaceSearch from "./FaceSearch";

const Dashboard: React.FC = () => {
  // For now, we'll use a hardcoded user ID
  const USER_ID = "2139ebbf-3082-48ae-8969-1c6f63efacca";

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Face Find & Trace Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">Your Reports</TabsTrigger>
              <TabsTrigger value="report-lost">Report Lost Person</TabsTrigger>
              <TabsTrigger value="face-search">Search by Face ID</TabsTrigger>
            </TabsList>
            <TabsContent value="reports">
              <UserReports userId={USER_ID} />
            </TabsContent>
            <TabsContent value="report-lost">
              <ReportLost userId={USER_ID} />
            </TabsContent>
            <TabsContent value="face-search">
              <FaceSearch />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
