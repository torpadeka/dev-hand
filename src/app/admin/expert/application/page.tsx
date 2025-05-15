"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  Github,
  Loader2,
  Search,
  SortAsc,
  SortDesc,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  application_id: number;
  full_name: string;
  github_link: string;
  status?: string;
  created_at: string;
}

export default function ExpertApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application;
    direction: "ascending" | "descending";
  }>({
    key: "created_at",
    direction: "descending",
  });

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/expert/get-all-applications");
        const data = await res.json();
        setApplications(data.applications || []);
        setFilteredApplications(data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    // Filter applications based on search term and status
    let result = [...applications];

    if (searchTerm) {
      result = result.filter(
        (app) =>
          app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.github_link.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((app) => {
        const status = app.status || "Pending";
        return status === statusFilter;
      });
    }

    // Sort applications
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredApplications(result);
  }, [applications, searchTerm, statusFilter, sortConfig]);

  const handleViewMore = (id: number) => {
    router.push(`/admin/expert/application/${id}`);
  };

  const handleSort = (key: keyof Application) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusText = status || "Pending";

    switch (statusText) {
      case "Approved":
        return <Badge className="bg-chart-2 text-secondary">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-chart-1 text-secondary">Rejected</Badge>;
      default:
        return (
          <Badge className="bg-chart-5 text-secondary-foreground">
            Pending
          </Badge>
        );
    }
  };

  const formatGithubUsername = (url: string) => {
    try {
      return url.replace(/^https?:\/\/(www\.)?github\.com\//, "");
    } catch {
      return url;
    }
  };

  const renderSortIcon = (key: keyof Application) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <SortAsc className="h-4 w-4 ml-1" />
    ) : (
      <SortDesc className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="container mx-auto p-5 text-foreground">
      <h1 className="text-2xl font-bold mb-6">Expert Applications</h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <Input
            placeholder="Search by name or GitHub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-primary border-border text-foreground"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-primary border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-primary border-border">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-button" />
          <p className="mt-4 text-foreground">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        // Empty State
        <div className="bg-primary border border-border rounded-lg p-8 text-center">
          <User className="h-12 w-12 mx-auto text-foreground/30" />
          <h3 className="mt-4 text-lg font-medium">No applications found</h3>
          <p className="mt-2 text-foreground/70">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "There are no expert applications yet"}
          </p>
        </div>
      ) : (
        // Applications Table
        <div className="bg-primary border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:text-button"
                    onClick={() => handleSort("full_name")}
                  >
                    <div className="flex items-center">
                      Applicant Name
                      {renderSortIcon("full_name")}
                    </div>
                  </TableHead>
                  <TableHead>GitHub</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-button"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {renderSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-button"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center">
                      Applied At
                      {renderSortIcon("created_at")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow
                    key={app.application_id}
                    className="border-t border-border hover:bg-background/30"
                  >
                    <TableCell className="font-medium">
                      {app.full_name}
                    </TableCell>
                    <TableCell>
                      <a
                        href={app.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-button hover:underline"
                      >
                        <Github className="h-4 w-4" />
                        <span>{formatGithubUsername(app.github_link)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-chart-3" />
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleViewMore(app.application_id)}
                        className="bg-button text-button-foreground hover:bg-button/90"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
