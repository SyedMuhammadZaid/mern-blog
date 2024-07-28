import { BrowserRouter, Routes, Route } from "react-router-dom";
import FooterComp from "./components/Footer";
import Header from "./components/Header";
import OnlyAdminProtectedRoute from "./components/OnlyAdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Search from "./pages/Search";
import SeenPost from "./pages/SeenPost";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UpdatePost from "./pages/UpdatePost";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminProtectedRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/post/:postSlug" element={<SeenPost />} />
          <Route path="/Search" element={<Search />} />
        </Routes>
        <FooterComp />
      </BrowserRouter>
    </>
  );
}

export default App;
