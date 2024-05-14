import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Meta from "./Components/Meta";
import videoBg from "./Assets/bgVideo.mp4";
import { useEffect, useRef } from "react";

const App = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  const videoRef = useRef();
  const setPlayBack = () => {
    videoRef.current.playbackRate = 0.8;
  };

  return (
    <>
      <Meta
        title={Meta.title}
        description={Meta.description}
        keyword={Meta.keyword}
      />
      <video
        src={videoBg}
        ref={videoRef}
        autoPlay
        loop
        muted
        onCanPlay={setPlayBack}
      />
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
        <Footer />
      </main>
      <ToastContainer className="tc" />
    </>
  );
};
export default App;
