interface IWebGLData {
  supportsWebGL: boolean;

  maxTextureSize: number;
  supports4kTextures: boolean;
  supports8kTextures: boolean;
  supports16kTextures: boolean;

  supportsInstancing: boolean;
  supportsFloatTextures: boolean;

  lowPerformance: boolean;
}