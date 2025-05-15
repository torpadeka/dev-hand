"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Github,
  Info,
  Loader2,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Certificate {
  certificate_id: number;
  file_url: string;
  description: string;
}

interface ApplicationDetail {
  application_id: number;
  full_name: string;
  github_link: string;
  about_self: string;
  reason: string;
  additional_info: string;
  status: string;
  created_at: string;
  certificates: Certificate[];
  categories: string[];
}

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [status, setStatus] = useState<string>("Pending");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    async function fetchApplication() {
      setLoading(true);
      try {
        const res = await fetch(`/api/expert/get-application/${applicationId}`);
        if (!res.ok) throw new Error("Failed to fetch application");
        const data = await res.json();
        setApplication(data.application);
        setStatus(data.application.status ?? "Pending");
        setLoading(false);
      } catch (err) {
        setError("Failed to load application details.");
        setLoading(false);
      }
    }

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const updateStatus = async (newStatus: string) => {
    if (!application) return;

    setIsUpdating(true);
    try {
      const res = await fetch(
        `/api/expert/get-application/${application.application_id}/update-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      setStatus(newStatus);
      setIsUpdating(false);
    } catch (err) {
      setIsUpdating(false);
      setError("Error updating application status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-button" />
        <p className="mt-4 text-foreground">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-destructive text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl font-semibold">{error}</p>
          <Button
            className="mt-4 bg-button text-button-foreground"
            onClick={() => router.push("/admin/expert/application")}
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-foreground text-center">
          <Info className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl font-semibold">Application not found</p>
          <Button
            className="mt-4 bg-button text-button-foreground"
            onClick={() => router.push("/admin/expert/application")}
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-chart-2 text-secondary";
      case "Rejected":
        return "bg-chart-1 text-secondary";
      default:
        return "bg-chart-5 text-secondary-foreground";
    }
  };

  return (
    <div className="container mx-auto p-5 text-foreground">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Application Details</h1>
        <Badge className={`text-sm px-3 py-1 ${getStatusColor(status)}`}>
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="bg-primary border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm text-foreground opacity-70 mb-1">
                Full Name
              </h3>
              <p className="font-medium">{application.full_name}</p>
            </div>

            <div>
              <h3 className="text-sm text-foreground opacity-70 mb-1">
                GitHub
              </h3>
              <a
                href={application.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-button hover:underline"
              >
                <Github className="h-4 w-4" />
                {application.github_link.replace(
                  /^https?:\/\/(www\.)?github\.com\//,
                  ""
                )}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div>
              <h3 className="text-sm text-foreground opacity-70 mb-1">
                Applied On
              </h3>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-chart-3" />
                {new Date(application.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-foreground opacity-70 mb-1">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {application.categories.map((category, index) => (
                  <Badge
                    key={index}
                    className="bg-chart-3/20 text-chart-3 border border-chart-3/30"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card className="bg-primary border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Details
            </CardTitle>
            <CardDescription>
              Detailed information provided by the applicant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-button mb-2">About</h3>
              <p className="text-foreground bg-background p-3 rounded-md">
                {application.about_self}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-button mb-2">
                Motivation
              </h3>
              <p className="text-foreground bg-background p-3 rounded-md">
                {application.reason}
              </p>
            </div>

            {application.additional_info && (
              <div>
                <h3 className="text-sm font-medium text-button mb-2">
                  Additional Information
                </h3>
                <p className="text-foreground bg-background p-3 rounded-md">
                  {application.additional_info}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="bg-primary border-border md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Certificates
            </CardTitle>
            <CardDescription>
              Certificates uploaded by the applicant
            </CardDescription>
          </CardHeader>
          <CardContent>
            {application.certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {application.certificates.map((cert) => (
                  <a
                    key={cert.certificate_id}
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-background/80 transition-colors"
                  >
                    <div className="bg-chart-4/20 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-chart-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-medium truncate">{cert.description}</p>
                      <p className="text-xs text-foreground/70">
                        View certificate
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-foreground/50" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-foreground/70">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No certificates uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          onClick={() => router.push("/admin/expert/application")}
          variant="outline"
          className="border-border text-foreground hover:bg-background"
        >
          Back to Applications
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={status === "Rejected" || isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject Application
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-primary border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this application? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border text-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground"
                onClick={() => updateStatus("Rejected")}
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-chart-2 text-white hover:bg-chart-2/90"
              disabled={status === "Approved" || isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve Application
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-primary border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this application? This will
                grant the applicant expert status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border text-foreground">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-chart-2 text-white"
                onClick={() => updateStatus("Approved")}
              >
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
