import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.tsx";
import Index from "./pages/Index";
import AuthorDetail from "./pages/AuthorDetail";
import StoryDetail from "./pages/StoryDetail";
import ChapterList from "./pages/ChapterList";
import ChapterReader from "./pages/ChapterReader";
import ShortStoryReader from "./pages/ShortStoryReader";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStories from "./pages/admin/AdminStories";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminChapters from "./pages/admin/AdminChapters";
import AdminFAQs from "./pages/admin/AdminFAQs";
import Bookmarks from "./pages/Bookmarks";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/author/:id" element={<AuthorDetail />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/story/:id/chapters" element={<ChapterList />} />
          <Route path="/story/:id/chapter/:chapterNum" element={<ChapterReader />} />
          <Route path="/story/:id/read" element={<ShortStoryReader />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/stories" element={<AdminLayout><AdminStories /></AdminLayout>} />
          <Route path="/admin/authors" element={<AdminLayout><AdminAuthors /></AdminLayout>} />
          <Route path="/admin/authors/:authorId/faqs" element={<AdminLayout><AdminFAQs /></AdminLayout>} />
          <Route path="/admin/stories/:storyId/chapters" element={<AdminLayout><AdminChapters /></AdminLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
