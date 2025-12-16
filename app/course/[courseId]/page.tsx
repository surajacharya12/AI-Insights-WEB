"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { ArrowLeft, BookMarked, Clock, ChartBar, CheckCircle2 } from "lucide-react";

import { Skeleton } from "../../../components/ui/skeleton";
import { SidebarProvider } from "../../../components/ui/sidebar";
import AppNavbar from "../../components/app-navbar";
import { AppSidebar } from "../../components/app-sidebar";
import { useUser } from "../../context/UserContext";

import API_URL from "../../api/api_url";
import ChapterContent from "../_components/chaptercontent";
import CourseAccordion from "../_components/CourseAccordion";

// StatBadge Component
function StatBadge({ icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colors: any = {
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${colors[color]}`}>
      {icon}
      <span>{value}</span>
    </div>
  );
}

export default function Course() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

  // Fetch Data (Combined)
  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, contentRes] = await Promise.all([
          axios.get(`${API_URL}/api/get-courses?courseId=${courseId}`),
          axios.get(`${API_URL}/api/generate-course-content?courseId=${courseId}`)
        ]);

        setCourseInfo(courseRes.data);
        setGeneratedContent(contentRes.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Check enrollment status
  useEffect(() => {
    if (!courseId || !user?.id) {
      setEnrollmentLoading(false);
      return;
    }

    const checkEnrollment = async () => {
      try {
        setEnrollmentLoading(true);
        const res = await axios.get(`${API_URL}/api/enroll?userId=${user.id}`);
        const enrolledCourses = res.data || [];
        const isUserEnrolled = enrolledCourses.some(
          (item: any) => item.courses?.cid === courseId || item.enrollments?.courseId === courseId
        );
        setIsEnrolled(isUserEnrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setIsEnrolled(false);
      } finally {
        setEnrollmentLoading(false);
      }
    };

    checkEnrollment();
  }, [courseId, user?.id]);

  // Process Data
  const { course, bannerSrc } = useMemo(() => {
    if (!courseInfo || !generatedContent) return { course: null, bannerSrc: null };

    const processedCourse = {
      ...courseInfo,
      courseContent: generatedContent?.CourseContent || [],
      courseName: generatedContent?.courseName || courseInfo?.name || "",
    };

    const courseLayout = processedCourse.courseJson?.course;

    const bannerSrcRaw =
      courseLayout?.bannerImageBase64 ||
      processedCourse.bannerImageBase64 ||
      processedCourse.bannerImageURL ||
      null;

    let processedBannerSrc = null;
    if (bannerSrcRaw) {
      if (bannerSrcRaw.startsWith("http") || bannerSrcRaw.startsWith("data:image")) {
        processedBannerSrc = bannerSrcRaw;
      } else {
        processedBannerSrc = `data:image/png;base64,${bannerSrcRaw}`;
      }
    }

    return { course: processedCourse, bannerSrc: processedBannerSrc };
  }, [courseInfo, generatedContent]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-[300px] w-full md:w-1/3 rounded-xl" />
          <div className="w-full space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Course not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  const chapters = course.courseContent || [];
  const courseLayout = course.courseJson?.course;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppNavbar />
          <main className="flex-1 overflow-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="mb-10">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-5">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 tracking-tight">
                    {course.courseName}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{courseLayout?.description}</p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <StatBadge
                      icon={<Clock className="w-4 h-4" />}
                      label="Duration"
                      value={courseLayout?.duration || "N/A"}
                      color="indigo"
                    />
                    <StatBadge
                      icon={<BookMarked className="w-4 h-4" />}
                      label="Chapters"
                      value={`${chapters.length} Chapters`}
                      color="green"
                    />
                    <StatBadge
                      icon={<ChartBar className="w-4 h-4" />}
                      label="Level"
                      value={courseLayout?.level || "Intermediate"}
                      color="red"
                    />
                    {isEnrolled && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enrolled</span>
                      </div>
                    )}
                  </div>
                </div>

                {bannerSrc && (
                  <div className="relative w-full lg:w-[400px] h-[220px] rounded-xl overflow-hidden shadow-lg border border-gray-200 shrink-0">
                    <Image src={bannerSrc} alt="Course Banner" fill className="object-cover" priority />
                  </div>
                )}
              </div>
            </div>

            <hr className="my-8 border-gray-200" />
            <div className="flex flex-col md:flex-row">
              {/* Modern Accordion with Progress Tracking */}
              <CourseAccordion
                chapters={chapters}
                courseId={courseId}
                userId={user?.id}
                isEnrolled={isEnrolled}
              />

              {/* Optional: ChapterContent */}
              <ChapterContent course={course} />
            </div>

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
