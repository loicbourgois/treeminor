#version 300 es

in vec2 a_position;
uniform vec2 u_scale;
out vec2 position;

void main() {
  position = a_position;
  gl_Position = vec4(a_position * u_scale, 0, 1);
}
