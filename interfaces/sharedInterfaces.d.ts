interface MousePosition {
  x: number;
  y: number;
}

interface ShaderUniform {
  type: string,
  value: any
}

interface ShaderUniformFloat extends ShaderUniform {
  value: number
}

interface ShaderUniformVector extends ShaderUniform {
  value: Array<number>
}