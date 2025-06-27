// Animated background SVG generator
export function createAnimatedBackground() {
  const svgNS = "http://www.w3.org/2000/svg";
  
  // Create multiple wave paths for layered effect
  const waves = [
    {
      d: "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
      fill: "rgba(14, 165, 233, 0.1)",
      animationDuration: "25s"
    },
    {
      d: "M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,138.7C672,171,768,213,864,213.3C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
      fill: "rgba(56, 189, 248, 0.1)",
      animationDuration: "20s"
    },
    {
      d: "M0,64L48,74.7C96,85,192,107,288,122.7C384,139,480,149,576,128C672,107,768,53,864,48C960,43,1056,85,1152,101.3C1248,117,1344,107,1392,101.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
      fill: "rgba(125, 211, 252, 0.1)",
      animationDuration: "15s"
    }
  ];
  
  return waves;
}

// Initialize animated background on pages that need it
export function initAnimatedBackground(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const waves = createAnimatedBackground();
  
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1440 320");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("absolute", "w-full", "h-full");
  
  waves.forEach((wave, index) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", wave.d);
    path.setAttribute("fill", wave.fill);
    path.style.animation = `float ${wave.animationDuration} ease-in-out infinite`;
    path.style.animationDelay = `${index * 2}s`;
    svg.appendChild(path);
  });
  
  container.appendChild(svg);
}