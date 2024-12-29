import { useEffect, useRef } from 'react';
import { cacheLfoValues } from './Lfo';
import { ControllerId, controllerInfo } from './Modulation';
import { useStore } from '../store';

var cachedLfoValues = cacheLfoValues(0);

const displayVertices = new Float32Array([
  -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
]);

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentSourceRed = `
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Red color
  }
`;

const fragmentShaderSourceOsc = `
  precision mediump float;
  uniform vec3 u_osc_color;
  uniform float u_osc_freq;
  uniform float u_osc_speed;
  uniform float u_osc_sharpen;
  uniform vec2 u_osc_center;
  uniform vec2 u_osc_resolution;
  uniform float u_osc_time;
  void main() {
      vec2 st = (gl_FragCoord.xy - u_osc_center * abs(u_osc_center) - u_osc_resolution / 2.0) / u_osc_resolution;
      st = st * u_osc_freq * u_osc_freq;
      float dist = length(st);
      float a = 0.5 + 0.5 * cos(20.0 * dist - u_osc_time * u_osc_speed * u_osc_freq) * u_osc_sharpen * u_osc_sharpen;
      gl_FragColor = vec4(u_osc_color, a);
  }
`;

class ParameterConfig {
  name: string;
  location: string;
  size: number;
  controllerIds: ControllerId[];

  constructor(name: string, location: string, size: number, controllerIds: ControllerId[]) {
    this.name = name;
    this.location = location;
    this.size = size;
    this.controllerIds = controllerIds;
  }
}

class oscillatorConfig {
  parameters: ParameterConfig[];

  constructor(parameters: ParameterConfig[]) {
    this.parameters = parameters;
  }
}

const oscillatorTypes = {
  'osc': new oscillatorConfig([
    new ParameterConfig('color', 'u_osc_color', 3, [ControllerId.R, ControllerId.G, ControllerId.B]),
    new ParameterConfig('freq', 'u_osc_freq', 1, [ControllerId.Freq]),
    new ParameterConfig('speed', 'u_osc_speed', 1, [ControllerId.Speed]),
    new ParameterConfig('sharpen', 'u_osc_sharpen', 1, [ControllerId.Sharp]),
    new ParameterConfig('center', 'u_osc_center', 2, [ControllerId.X, ControllerId.Y]),
    new ParameterConfig('resolution', 'u_osc_resolution', 2, []),
    new ParameterConfig('time', 'u_osc_time', 1, []),
  ]),
};

class Oscillator {
  type: string;
  config: oscillatorConfig;
  locations: { [key: string]: WebGLUniformLocation };

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, type: string, config: oscillatorConfig) {
    this.type = type;
    this.config = config;
    this.locations = {};

    for (const parameter of config.parameters) {
      this.locations[parameter.name] = gl.getUniformLocation(program, parameter.location)!;
    }
  }

  setParameter(gl: WebGLRenderingContext, parameterName: string, value: number[]) {
    const location = this.locations[parameterName];
    if (location) {
      switch (value.length) {
        case 1:
          gl.uniform1f(location, value[0]);
          break;
        case 2:
          gl.uniform2fv(location, value);
          break;
        case 3:
          gl.uniform3fv(location, value);
          break;
        case 4:
          gl.uniform4fv(location, value);
          break;
      }
    }
  }
}

const createOscillator = (gl: WebGLRenderingContext, program: WebGLProgram, type: string): Oscillator => {
  const config = oscillatorTypes[type];
  return new Oscillator(gl, program, type, config);
};

const createVertexShader = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
): WebGLShader => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      'Error compiling vertex shader:',
      gl.getShaderInfoLog(vertexShader),
    );
    gl.deleteShader(vertexShader);
    throw new Error('Error compiling vertex shader');
  }
  return vertexShader;
};

const linkProgram = (
  gl,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error('Error linking program');
  }

  return program;
};

const createFragmentShader = (
  gl: WebGLRenderingContext,
  fragmentShaderSource: string,
): WebGLShader => {
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      'Error compiling fragment shader:',
      gl.getShaderInfoLog(fragmentShader),
    );
    gl.deleteShader(fragmentShader);
    throw new Error('Error compiling fragment shader');
  }
  return fragmentShader;
};

const renderProgram = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  // Use the program
  gl.useProgram(program);

  // Create a buffer and put the vertices in it
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, displayVertices, gl.STATIC_DRAW);

  // Set position attribute
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(
    positionLocation,
    2 /*components per vertex*/,
    gl.FLOAT,
    false /*normalize*/,
    0 /*stride*/,
    0 /*offset*/,
  );

  // Draw the square
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const getControllerValue = (
  oscId: number,
  controllerId: number,
): number => {
  const oscillator =
    useStore.getState().patch.controllerValues.oscillators[oscId];
  let value = oscillator.controllers[controllerId];
  if (oscillator.modulationSettings[controllerId].lfoId != -1) {
    const lfoId = oscillator.modulationSettings[controllerId].lfoId;
    const lfoValue = cachedLfoValues[lfoId];
    const lfoAmount =
      oscillator.modulationSettings[controllerId].amount;
    switch (controllerInfo[controllerId].transform) {
      case 'add':
        value =
          value +
          lfoValue *
            lfoAmount *
            (controllerInfo[controllerId].max -
              controllerInfo[controllerId].min);
        break;
      case 'multiply':
        value = value * (1 + lfoValue * lfoAmount);
        break;
      default:
        throw new Error('Unknown transform type');
    }
    return value;
  }
  return value;
};

const initializeWebGL = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    throw new Error('WebGL not supported');
  }

  const vertexShader = createVertexShader(gl!, vertexShaderSource);
  const fragmentShader = createFragmentShader(gl, fragmentShaderSourceOsc)!;
  const program = linkProgram(gl, vertexShader, fragmentShader)!;

  const oscillator = createOscillator(gl, program, 'osc');

  const render = (time: number) => {
    cachedLfoValues = cacheLfoValues(time);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    oscillator.setParameter(gl, 'color', [getControllerValue(0, ControllerId.R), getControllerValue(0, ControllerId.G), getControllerValue(0, ControllerId.B)]);
    oscillator.setParameter(gl, 'freq', [getControllerValue(0, ControllerId.Freq)]);
    oscillator.setParameter(gl, 'speed', [getControllerValue(0, ControllerId.Speed)]);
    oscillator.setParameter(gl, 'sharpen', [getControllerValue(0, ControllerId.Sharp)]);
    oscillator.setParameter(gl, 'center', [getControllerValue(0, ControllerId.X), getControllerValue(0, ControllerId.Y)]);
    oscillator.setParameter(gl, 'resolution', [400.0, 400.0]);
    oscillator.setParameter(gl, 'time', [time * 0.001]);

    renderProgram(gl, program);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};

export const RawWebGLCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializeWebGL(canvasRef.current);
    }
  }, []);

  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
};
