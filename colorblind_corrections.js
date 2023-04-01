var ffi = require("ffi")
var ref = require("ref")
var int = ref.types.int
var platform = process.platform
var lib = null

if (platform === "win32") {
    lib = "./OURLIB.dll"
} else if (platform === "linux") {
    lib = "./OURLIB.so"
} else if (platform === "darwin") {
    lib = "./OURLIB.dylib"
} else {
    throw new Error("Unsupported OS")
}

var colorblindCorrection = ffi.Library(OURLIB, {
    funcName: [returnType, [param1, param2]],
    funcName2: [returnType2, [param1, param2]]
})

module.exports = colorblindCorrection