import { World } from './world';

export class Renderer {

  //
  // Properties
  //
  canvas;
  fragmentShader;
  vertexShader;
  world: World;
  gl;
  POINT_RADIUS;
  backgroundExtendedProgram;
  pointsExtendedProgram;

  //
  // Constructor
  //
  constructor(canvas, shadersSource, world) {
    this.POINT_RADIUS = 0.05;
    this.canvas = canvas;
    this.world = world;
    this.gl = canvas.getContext('webgl2');
    if (!this.gl) {
      console.error('No Web.gl for you');
    }

    // Enable blending
    this.gl.enable(this.gl.BLEND);

    // Use additive blending to stack up drawings
    // Source : https://stackoverflow.com/a/35544537
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

    //
    this.backgroundExtendedProgram = this.getExtendedProgram(shadersSource.world);
    const defaultExtendeProgram = this.getExtendedProgram(shadersSource.default);
    this.pointsExtendedProgram = this.getExtendedProgram(shadersSource.points);
  }

  //
  //
  //
  draw() {
    const scale = [0.9 / this.world.getWidth() * 2, 0.9 / this.world.getHeight() * 2];
    this.clearCanvas();
    this.drawTriangles(this.backgroundExtendedProgram, this.world.getBackgroundPositions(), scale);
    this.drawPoints(this.pointsExtendedProgram, this.world.getPointsPositions(), scale);
  }

  //
  // Given a set of shaders, returns a program, its attributs locations and its uniforms locations
  //
  getExtendedProgram(shadersSource) {
    //
    // Create program
    //
    const extendeProgram = {
      program: null,
      a_position: null,
      u_scale: null,
      radius: null,
      center: null
    };
    const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, shadersSource.vert);
    const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, shadersSource.frag);
    extendeProgram.program = this.createProgram(this.gl, vertexShader, fragmentShader);
    extendeProgram.a_position = this.gl.getAttribLocation(extendeProgram.program, 'a_position');
    extendeProgram.u_scale = this.gl.getUniformLocation(extendeProgram.program, 'u_scale');
    extendeProgram.center = this.gl.getUniformLocation(extendeProgram.program, 'center');
    extendeProgram.radius = this.gl.getUniformLocation(extendeProgram.program, 'radius');
    return extendeProgram;
  }

  //
  //
  //
  drawTriangles(extendeProgram, data, scale) {
    //
    // Buffer
    //
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    //
    // Vertex Array
    //
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);
    // Tell WebGL that the attribute should be filled with data from our array buffer
    this.gl.enableVertexAttribArray(extendeProgram.a_position);
    //
    // binds the buffer currently bound to gl.ARRAY_BUFFER
    // to a generic vertex attribute of the current vertex buffer object and specifies its layout
    //
    const size = 2;                   // 2 components per iteration
    const type = this.gl.FLOAT;       // the data is 32bit floats
    const normalize = false;          // don't normalize the data
    const stride = 0;                 // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;                 // start at the beginning of the buffer
    const count = data.length / size; // number of datapoints
    this.gl.vertexAttribPointer(
        extendeProgram.a_position, size, type, normalize, stride, offset
    );
    // Resizing
    this.resizeCanvasAndViewport();
    // Register program tu use
    this.gl.useProgram(extendeProgram.program);
    // Pass vertex array
    this.gl.bindVertexArray(vao);
    // Set scale
    this.gl.uniform2fv(extendeProgram.u_scale, scale);
    // What to draw
    const primitiveType = this.gl.TRIANGLES;
    // Draw it
    this.gl.drawArrays(primitiveType, offset, count);
  }

  //
  //
  //
  drawPoints(extendeProgram, points, scale) {
    points.forEach(point => {
      this.drawPoint(extendeProgram, point, scale);
    });
  }

  //
  //
  //
  drawPoint(extendeProgram, center, scale) {

    const length = 0.15;
    const data = [
      center[0] - length, center[1] - length,
      center[0] + length, center[1] - length,
      center[0] - length, center[1] + length,
      center[0] + length, center[1] + length,
      center[0] + length, center[1] - length,
      center[0] - length, center[1] + length
    ];
    //
    // Buffer
    //
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    //
    // Vertex Array
    //
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);
    // Tell WebGL that the attribute should be filled with data from our array buffer
    this.gl.enableVertexAttribArray(extendeProgram.a_position);
    //
    // binds the buffer currently bound to gl.ARRAY_BUFFER
    // to a generic vertex attribute of the current vertex buffer object and specifies its layout
    //
    const size = 2;                   // 2 components per iteration
    const type = this.gl.FLOAT;       // the data is 32bit floats
    const normalize = false;          // don't normalize the data
    const stride = 0;                 // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;                 // start at the beginning of the buffer
    const count = data.length / size; // number of datapoints
    this.gl.vertexAttribPointer(
        extendeProgram.a_position, size, type, normalize, stride, offset
    );
    // Resizing
    this.resizeCanvasAndViewport();
    // Register program tu use
    this.gl.useProgram(extendeProgram.program);
    // Pass vertex array
    this.gl.bindVertexArray(vao);
    // Set scale
    this.gl.uniform2fv(extendeProgram.u_scale, scale);
    //
    this.gl.uniform2fv(extendeProgram.center, center);
    this.gl.uniform1f(extendeProgram.radius, this.POINT_RADIUS);
    // What to draw
    const primitiveType = this.gl.TRIANGLES;
    // Draw it
    this.gl.drawArrays(primitiveType, offset, count);
  }

  //
  //
  //
  clearCanvas() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  //
  //
  //
  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(this.gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
  }

  //
  //
  //
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
    this.gl.deleteProgram(program);
  }

  //
  //
  //
  resizeCanvasAndViewport() {
    this.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  //
  //
  //
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
