import { useEffect, useMemo } from "react";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";

let particles = {
    backgroundColor: '#EBF0FF',
    particlesColor: '#03A9F4',
    particleMode: 'repulse'
}

const ParticlesComponent = (props) => {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: particles.backgroundColor,
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: particles.particleMode,
          },
          onHover: {
            enable: true,
            mode: particles.particleMode,
          },
        },
        modes: {
          push: {
            distance: 200,
            duration: 15,
          },
          grab: {
            distance: 150,
          },
        },
      },
      particles: {
        color: {
          value: particles.particlesColor,
        },
        links: {
          color: particles.particlesColor,
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 1.0,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  return <Particles id={props.id} options={options}/>; 
};

export default ParticlesComponent;