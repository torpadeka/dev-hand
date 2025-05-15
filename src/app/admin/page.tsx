"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  FileText,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const recentActivity = [
  {
    id: 1,
    action: "Application approved",
    user: "John Doe",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "New application submitted",
    user: "Jane Smith",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Application rejected",
    user: "Mike Johnson",
    time: "1 day ago",
  },
  {
    id: 4,
    action: "User settings updated",
    user: "Admin",
    time: "2 days ago",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<ApplicationStats>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/expert/get-summary");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.log("Failed to load application stats.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-foreground/70 mt-1">
            Overview of your application management system
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-button text-button-foreground">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats?.total || 0}
              </div>
              <div className="p-2 bg-chart-3/20 rounded-full">
                <FileText className="h-5 w-5 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats?.pending || 0}
              </div>
              <div className="p-2 bg-chart-5/20 rounded-full">
                <Clock className="h-5 w-5 text-chart-5" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-foreground/70">
              <Activity className="h-3 w-3 mr-1" />
              <span>Requires your attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats?.approved || 0}
              </div>
              <div className="p-2 bg-chart-2/20 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats?.rejected || 0}
              </div>
              <div className="p-2 bg-chart-1/20 rounded-full">
                <XCircle className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="bg-primary border-border lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/expert/application">
              <Button
                variant="outline"
                className="w-full justify-between border-border hover:bg-background hover:text-foreground"
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>View Applications</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="w-full justify-between border-border hover:bg-background hover:text-foreground"
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Manage Users</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button
                variant="outline"
                className="w-full justify-between border-border hover:bg-background hover:text-foreground"
              >
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span>View Analytics</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-primary border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <div className="h-9 w-9 rounded-full bg-background"></div>
                        <div className="space-y-1 flex-1">
                          <div className="h-4 w-3/4 bg-background rounded"></div>
                          <div className="h-3 w-1/2 bg-background rounded"></div>
                        </div>
                      </div>
                    ))
                : recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4"
                    >
                      <div className="h-9 w-9 rounded-full bg-chart-4/20 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-chart-4" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-foreground/70">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-button">
              View All Activity
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
