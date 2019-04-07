#version 300 es

// Use "medium precision"
precision mediump float;

// Position passed by the vertex shader
in vec2 position;
// Exact coordnitates for the center of the point
uniform vec2 center;
// Point radius
uniform float radius;
// Colour returned by the fragment shader after computation
out vec4 outColor;

void main() {

  // Set colour

  if(distance(center, position) < radius) {
    // We are inside the disk defining the point

    outColor = vec4(1.0, 0.5, 0.5, 1.0) * sin(distance(center, position) * 1000.0 * radius);

  } else {
    // We are outside the disk defining the point

    outColor = vec4(0, 0, 0, 0);

  }

}
