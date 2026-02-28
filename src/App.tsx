import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeContext, useThemeProvider } from "./hooks/useTheme";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Spinner } from "./components/ui/Spinner";
import { HomePage } from "./pages/public/HomePage";
import { BlogListPage } from "./pages/public/BlogListPage";
import { BlogPostPage } from "./pages/public/BlogPostPage";

const LoginPage = lazy(() =>
  import("./pages/admin/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const DashboardLayout = lazy(() =>
  import("./pages/admin/DashboardLayout").then((m) => ({ default: m.DashboardLayout }))
);
const EditIntro = lazy(() =>
  import("./pages/admin/EditIntro").then((m) => ({ default: m.EditIntro }))
);
const EditExperience = lazy(() =>
  import("./pages/admin/EditExperience").then((m) => ({ default: m.EditExperience }))
);
const EditProjects = lazy(() =>
  import("./pages/admin/EditProjects").then((m) => ({ default: m.EditProjects }))
);
const PostsManager = lazy(() =>
  import("./pages/admin/PostsManager").then((m) => ({ default: m.PostsManager }))
);
const PostEditor = lazy(() =>
  import("./pages/admin/PostEditor").then((m) => ({ default: m.PostEditor }))
);

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const themeValue = useThemeProvider();

  return (
    <ThemeContext.Provider value={themeValue}>
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/blog"
            element={
              <PublicLayout>
                <BlogListPage />
              </PublicLayout>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <PublicLayout>
                <BlogPostPage />
              </PublicLayout>
            }
          />

          {/* Admin routes (lazy loaded) */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="intro" element={<EditIntro />} />
            <Route path="experience" element={<EditExperience />} />
            <Route path="projects" element={<EditProjects />} />
            <Route path="posts" element={<PostsManager />} />
            <Route path="posts/:id" element={<PostEditor />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    </ThemeContext.Provider>
  );
}
