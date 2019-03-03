export class Renderer {

  canvas;
  fragmentShader;
  fragmentShaderSource;
  vertexShader;
  vertexShaderSource;

  constructor(canvas, fragmentShaderSource, vertexShaderSource) {
    this.canvas = canvas;
    this.fragmentShaderSource = fragmentShaderSource;
    this.vertexShaderSource = vertexShaderSource;
    const gl = canvas.getContext('webgl2');
    if(!gl) {
    }

    this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
    this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
    let program = this.createProgram(gl, this.vertexShader, this.fragmentShader);

    // Attributes
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // Buffer
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      0, 0,
      0, 0.5,
      0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // Vertex Array
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)
    // Resizing
    this.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    //
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }

  createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    let displayWidth  = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    // Check if the canvas is not the same size.
    if (canvas.width  !== displayWidth ||
        canvas.height !== displayHeight) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }
}
