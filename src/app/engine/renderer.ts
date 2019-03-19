import { World } from './world';

export class Renderer {

  canvas;
  fragmentShader;
  vertexShader;
  world: World;

  constructor(canvas, shadersSource, world) {
    this.canvas = canvas;
    this.world = world;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('No WebGL for you');
    }
    const scale = [0.9 / this.world.getWidth(), 0.9 / this.world.getHeight()];
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //
    // World shader
    //
    {
      this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, shadersSource.world.vert);
      this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, shadersSource.world.frag);
      const program = this.createProgram(gl, this.vertexShader, this.fragmentShader);

      // Attributes
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      // Uniforms
      const scaleLocation = gl.getUniformLocation(program, 'u_scale');
      // Buffer
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const width = this.world.getWidth();
      const height = this.world.getHeight();
      const positions = [
        -width, -height,
        width, -height,
        -width, height,
        width, height,
        width, -height,
        -width, height
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      // Vertex Array
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      gl.enableVertexAttribArray(positionAttributeLocation);
      const size = 2;          // 2 components per iteration
      const type = gl.FLOAT;   // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          positionAttributeLocation, size, type, normalize, stride, offset);
      // Resizing
      this.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      //
      gl.useProgram(program);
      // Pass atributs
      gl.bindVertexArray(vao);
      // Set scale
      gl.uniform2fv(scaleLocation, scale);
      //
      const primitiveType = gl.TRIANGLES;
      const count = 6;
      gl.drawArrays(primitiveType, offset, count);
    }
    //
    // Default shader
    //
    {
      this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, shadersSource.default.vert);
      this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, shadersSource.default.frag);
      const program = this.createProgram(gl, this.vertexShader, this.fragmentShader);

      // Attributes
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      // Uniforms
      const scaleLocation = gl.getUniformLocation(program, 'u_scale');
      // Buffer
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [
        0, 0,
        0, 1.0,
        0.5, 0,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      // Vertex Array
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      gl.enableVertexAttribArray(positionAttributeLocation);
      const size = 2;          // 2 components per iteration
      const type = gl.FLOAT;   // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(
          positionAttributeLocation, size, type, normalize, stride, offset);
      // Resizing
      this.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      //
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      // Set scale
      gl.uniform2fv(scaleLocation, scale);
      //
      const primitiveType = gl.TRIANGLES;
      const count = 3;
      gl.drawArrays(primitiveType, offset, count);
    }
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }
}
