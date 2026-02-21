"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  Mail,
  MessageCircle,
  BookOpen,
  Video,
  FileText,
  Loader2,
  ExternalLink,
  LayoutDashboard,
  CalendarDays,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Programme {
  _id: string;
  title: string;
}

const faqs = [
  {
    id: 'faq1',
    question: 'How do I access my courses?',
    answer: 'Navigate to the "Courses" section in the sidebar to view all available courses in your programme. Click on any course to see the weekly content and activities.',
  },
  {
    id: 'faq2',
    question: 'How do I submit assignments?',
    answer: 'Go to the specific course screen where the assignment is located. Complete the assignment activity and click "Submit" when you\'re ready. You can track your submission status in the Grades section.',
  },
  {
    id: 'faq3',
    question: 'How do I join live classes?',
    answer: 'Live classes are scheduled in the Calendar section. Click on the meeting link when it\'s time for the class. You\'ll also find live class activities within course screens.',
  },
  {
    id: 'faq4',
    question: 'How do I track my progress?',
    answer: 'Your progress is automatically tracked as you complete screens and activities. View your overall progress on the Dashboard or check detailed grades in the Grades section.',
  },
  {
    id: 'faq5',
    question: 'Can I change my password?',
    answer: 'Yes! Go to your Profile page and look for the "Change Password" option. You\'ll need to enter your current password and then your new password twice.',
  },
  {
    id: 'faq6',
    question: 'How do I contact my instructors?',
    answer: 'You can view all instructors in the Team section. Use the Newsfeed to post questions or reach out via the contact information provided in their profiles.',
  },
  {
    id: 'faq7',
    question: 'What are SCORM packages?',
    answer: 'SCORM packages are interactive learning content that can include videos, quizzes, simulations, and more. Your progress in SCORM content is automatically tracked.',
  },
  {
    id: 'faq8',
    question: 'How do I view upcoming deadlines?',
    answer: 'Check the Calendar section to see all upcoming assignments, quizzes, exams, and live classes. The Dashboard also shows your next upcoming events.',
  },
];

const supportResources = [
  {
    icon: BookOpen,
    title: 'User Guide',
    description: 'Comprehensive guide to using the platform',
    action: 'View Guide',
    href: '#',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video walkthroughs',
    action: 'Watch Videos',
    href: '#',
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Technical documentation and resources',
    action: 'Read Docs',
    href: '#',
  },
];

export default function HelpPage() {
  const params = useParams();
  const programmeId = params.programmeId as string;
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const loadProgramme = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/programmes/${programmeId}`);
      setProgramme(data);
    } catch (err) {
      console.error('Failed to load programme:', err);
    } finally {
      setLoading(false);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeId) {
      loadProgramme();
    }
  }, [programmeId, loadProgramme]);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!programme) return null;

  const breadcrumbItems = [
    { label: "Programmes", href: "/dashboard" },
    { label: programme.title, href: `/programmes/${programmeId}` },
    { label: "Help" },
  ];

  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-6 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-4">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <HelpCircle className="h-7 w-7 text-[var(--color-primary)]" />
            Help & Support
          </h1>
          <p className="mt-1 text-slate-600">
            Find answers to common questions and get support
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Contact Support Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Need Help?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Our support team is here to assist you with any questions or issues.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:support@innov8iveacademy.com"
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Email Support</p>
                  <p className="text-sm text-slate-600">support@innov8iveacademy.com</p>
                </div>
              </a>
              <button
                type="button"
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">Live Chat</p>
                  <p className="text-sm text-slate-600">Chat with our team</p>
                </div>
              </button>
            </div>
          </div>

          {/* Support Resources */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Support Resources</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {supportResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={resource.title}
                    href={resource.href}
                    className="group flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:border-[var(--color-primary)] hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 font-semibold text-slate-900">{resource.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{resource.description}</p>
                    <span className="mt-3 flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                      {resource.action}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-2">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-lg border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"
                  >
                    <span className="font-medium text-slate-900">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white px-4 py-3 text-sm text-slate-600">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick Links</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href={`/programmes/${programmeId}/overview`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <LayoutDashboard className="h-4 w-4 text-slate-400" />
                Programme Overview
              </Link>
              <Link
                href={`/programmes/${programmeId}/courses`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <BookOpen className="h-4 w-4 text-slate-400" />
                My Courses
              </Link>
              <Link
                href={`/programmes/${programmeId}/calendar`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <CalendarDays className="h-4 w-4 text-slate-400" />
                Calendar
              </Link>
              <Link
                href={`/programmes/${programmeId}/team`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Users className="h-4 w-4 text-slate-400" />
                Team
              </Link>
            </div>
          </div>

          {/* Technical Support */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="flex items-center gap-2 font-semibold text-amber-900">
              <HelpCircle className="h-5 w-5" />
              Still need help?
            </h3>
            <p className="mt-2 text-sm text-amber-800">
              If you can't find the answer you're looking for, please don't hesitate to contact our support team. We're here to help you succeed!
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="mailto:support@innov8iveacademy.com"
                className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Contact Support
              </a>
              <a
                href="tel:+1234567890"
                className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
