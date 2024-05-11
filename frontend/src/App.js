import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import videoBg from "./Assets/bgVideo.mp4";
import { useEffect, useRef } from "react";

const App = () => {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  const videoRef = useRef();
  const setPlayBack = () => {
    videoRef.current.playbackRate = 0.6;
  };

  return (
    <>
      <video
        src={videoBg}
        ref={videoRef}
        autoPlay
        loop
        muted
        onCanPlay={setPlayBack}
      />
      <Header />
      <main className="pb-3 pt-5">
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
