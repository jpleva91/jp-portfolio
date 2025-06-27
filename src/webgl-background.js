// WebGL shader background inspired by Sarah Drasner
export class WebGLBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'webgl-canvas';
    this.container.appendChild(this.canvas);
    
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      console.warn('WebGL not supported');
      return;
    }
    
    this.time = 0;
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    
    this.init();
  }
  
  init() {
    // Vertex shader
    const vertexShader = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    // Fragment shader with animated gradients and noise
    const fragmentShader = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;
        
        // Create flowing gradients
        float t = time * 0.5;
        
        // Multiple layers of animated gradients
        vec3 color1 = hsv2rgb(vec3(0.55 + sin(t) * 0.1, 0.7, 0.9));
        vec3 color2 = hsv2rgb(vec3(0.6 + cos(t * 1.3) * 0.1, 0.8, 0.8));
        vec3 color3 = hsv2rgb(vec3(0.65 + sin(t * 0.7) * 0.1, 0.6, 0.95));
        
        // Create smooth noise patterns
        float n1 = smoothNoise(p * 3.0 + vec2(t * 0.2, t * 0.1));
        float n2 = smoothNoise(p * 5.0 - vec2(t * 0.1, t * 0.3));
        float n3 = smoothNoise(p * 8.0 + vec2(t * 0.15, -t * 0.2));
        
        // Mix colors with noise
        vec3 color = mix(color1, color2, n1);
        color = mix(color, color3, n2 * 0.5);
        
        // Add mouse interaction
        float mouseDist = length(uv - mouse);
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.5, mouseDist);
        color += vec3(0.1, 0.2, 0.3) * mouseInfluence * 0.3;
        
        // Add subtle scan lines
        float scanline = sin(uv.y * 800.0) * 0.02;
        color += scanline;
        
        // Add vignette
        float vignette = 1.0 - length(p) * 0.3;
        color *= vignette;
        
        // Dark theme adjustments
        color *= 0.3; // Darken for better text readability
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    // Create shaders
    const vs = this.createShader(this.gl.VERTEX_SHADER, vertexShader);
    const fs = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    
    // Create program
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vs);
    this.gl.attachShader(this.program, fs);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Shader program failed to link');
      return;
    }
    
    // Create buffer
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]);
    
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    
    // Get attribute and uniform locations
    const positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    
    this.timeLocation = this.gl.getUniformLocation(this.program, 'time');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'resolution');
    this.mouseLocation = this.gl.getUniformLocation(this.program, 'mouse');
    
    // Handle resize
    window.addEventListener('resize', () => this.resize());
    this.resize();
    
    // Track mouse
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX / window.innerWidth;
      this.mouseY = 1.0 - (e.clientY / window.innerHeight);
    });
    
    // Start animation
    this.animate();
  }
  
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  resize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    this.gl.viewport(0, 0, width, height);
  }
  
  animate() {
    this.time += 0.01;
    
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.timeLocation, this.time);
    this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.mouseLocation, this.mouseX, this.mouseY);
    
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Create WebGL background for hero section
    new WebGLBackground('particle-container');
  });
}