import dynamicRenderTextureRunner from "./dynamicRenderTextureRunner";

export default function CheckWebGLSupport(): IWebGLData {
  const returnData = {
    supportsWebGL: false,

    maxTextureSize: 4096,

    supports4kTextures: false,
    supports8kTextures: false,
    supports16kTextures: false,

    supportsInstancing: false,

    supportsFloatTextures: false,

    isSoftwareRenderer: false,

    lowPerformance: false
  };

  const canvas = document.createElement("canvas");

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (gl && gl instanceof WebGLRenderingContext) {
    returnData.supportsWebGL = true;
  }

  if (returnData.supportsWebGL) {
    // check texture size support
    returnData.maxTextureSize = gl!.getParameter(gl!.MAX_TEXTURE_SIZE);
    returnData.supports4kTextures = returnData.maxTextureSize >= 4096;
    returnData.supports8kTextures = returnData.maxTextureSize >= 8192;
    returnData.supports16kTextures = returnData.maxTextureSize >= 16384;

    // check extensions
    returnData.supportsInstancing = gl!.getExtension("ANGLE_instanced_arrays") !== null;
    returnData.supportsFloatTextures = gl!.getExtension("OES_texture_float") !== null;

    // check for software renderer
    const debugInfo = gl!.getExtension("WEBGL_debug_renderer_info");
    const vendor: string = gl!.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer: string = gl!.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    if (vendor === "Google Inc." && renderer === "Google SwiftShader") {
      returnData.isSoftwareRenderer = true;
    }

    if (renderer.includes("Software")) {
      returnData.isSoftwareRenderer = true;
    }

    returnData.lowPerformance =
      returnData.isSoftwareRenderer ||
      !returnData.supports4kTextures ||
      !returnData.supportsInstancing ||
      !returnData.supportsFloatTextures;
  }

  return returnData;
}
