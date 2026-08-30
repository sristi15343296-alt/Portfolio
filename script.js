function initReferenceFluid(){

let e, t, r, n, i;
let o = document.getElementById("fluid");
if (!o) return;
Y();
let a = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1440,
        DENSITY_DISSIPATION: .5,
        VELOCITY_DISSIPATION: 3,
        PRESSURE: .1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: .2,
        SPLAT_FORCE: 6e3,
        SHADING: !0,
        COLOR_UPDATE_SPEED: 10
    },
    l = [];
l.push(new function() {
    this.id = -1, this.texcoordX = 0, this.texcoordY = 0, this.prevTexcoordX = 0, this.prevTexcoordY = 0, this.deltaX = 0, this.deltaY = 0, this.down = !1, this.moved = !1, this.color = [0, 0, 0]
});
let {
    gl: s,
    ext: c
} = function(e) {
    let t, r, n, i, o;
    let a = {
            alpha: !0,
            depth: !1,
            stencil: !1,
            antialias: !1,
            preserveDrawingBuffer: !1
        },
        l = e.getContext("webgl2", a),
        s = !!l;
    s || (l = e.getContext("webgl", a) || e.getContext("experimental-webgl", a)), s ? (l.getExtension("EXT_color_buffer_float"), r = l.getExtension("OES_texture_float_linear")) : (t = l.getExtension("OES_texture_half_float"), r = l.getExtension("OES_texture_half_float_linear")), l.clearColor(0, 0, 0, 1);
    let c = s ? l.HALF_FLOAT : t.HALF_FLOAT_OES;
    return s ? (n = u(l, l.RGBA16F, l.RGBA, c), i = u(l, l.RG16F, l.RG, c), o = u(l, l.R16F, l.RED, c)) : (n = u(l, l.RGBA, l.RGBA, c), i = u(l, l.RGBA, l.RGBA, c), o = u(l, l.RGBA, l.RGBA, c)), {
        gl: l,
        ext: {
            formatRGBA: n,
            formatRG: i,
            formatR: o,
            halfFloatTexType: c,
            supportLinearFiltering: r
        }
    }
}(o);

function u(e, t, r, n) {
    if (! function(e, t, r, n) {
            let i = e.createTexture();
            e.bindTexture(e.TEXTURE_2D, i), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texImage2D(e.TEXTURE_2D, 0, t, 4, 4, 0, r, n, null);
            let o = e.createFramebuffer();
            return e.bindFramebuffer(e.FRAMEBUFFER, o), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0), e.checkFramebufferStatus(e.FRAMEBUFFER) == e.FRAMEBUFFER_COMPLETE
        }(e, t, r, n)) switch (t) {
        case e.R16F:
            return u(e, e.RG16F, e.RG, n);
        case e.RG16F:
            return u(e, e.RGBA16F, e.RGBA, n);
        default:
            return null
    }
    return {
        internalFormat: t,
        format: r
    }
}
c.supportLinearFiltering || (a.DYE_RESOLUTION = 256, a.SHADING = !1);
class d {
    setKeywords(e) {
        let t = 0;
        for (let r = 0; r < e.length; r++) t += function(e) {
            if (0 == e.length) return 0;
            let t = 0;
            for (let r = 0; r < e.length; r++) t = (t << 5) - t + e.charCodeAt(r) | 0;
            return t
        }(e[r]);
        let r = this.programs[t];
        if (null == r) {
            let n = h(s.FRAGMENT_SHADER, this.fragmentShaderSource, e);
            r = m(this.vertexShader, n), this.programs[t] = r
        }
        r != this.activeProgram && (this.uniforms = f(r), this.activeProgram = r)
    }
    bind() {
        s.useProgram(this.activeProgram)
    }
    constructor(e, t) {
        this.vertexShader = e, this.fragmentShaderSource = t, this.programs = [], this.activeProgram = null, this.uniforms = []
    }
}
class v {
    bind() {
        s.useProgram(this.program)
    }
    constructor(e, t) {
        this.uniforms = {}, this.program = m(e, t), this.uniforms = f(this.program)
    }
}

function m(e, t) {
    let r = s.createProgram();
    return s.attachShader(r, e), s.attachShader(r, t), s.linkProgram(r), s.getProgramParameter(r, s.LINK_STATUS) || console.trace(s.getProgramInfoLog(r)), r
}

function f(e) {
    let t = [],
        r = s.getProgramParameter(e, s.ACTIVE_UNIFORMS);
    for (let n = 0; n < r; n++) {
        let r = s.getActiveUniform(e, n).name;
        t[r] = s.getUniformLocation(e, r)
    }
    return t
}

function h(e, t, r) {
    t = function(e, t) {
        if (null == t) return e;
        let r = "";
        return t.forEach(e => {
            r += "#define " + e + "\n"
        }), r + e
    }(t, r);
    let n = s.createShader(e);
    return s.shaderSource(n, t), s.compileShader(n), s.getShaderParameter(n, s.COMPILE_STATUS) || console.trace(s.getShaderInfoLog(n)), n
}
let x = h(s.VERTEX_SHADER, "\n       precision highp float;\n   \n       attribute vec2 aPosition;\n       varying vec2 vUv;\n       varying vec2 vL;\n       varying vec2 vR;\n       varying vec2 vT;\n       varying vec2 vB;\n       uniform vec2 texelSize;\n   \n       void main () {\n           vUv = aPosition * 0.5 + 0.5;\n           vL = vUv - vec2(texelSize.x, 0.0);\n           vR = vUv + vec2(texelSize.x, 0.0);\n           vT = vUv + vec2(0.0, texelSize.y);\n           vB = vUv - vec2(0.0, texelSize.y);\n           gl_Position = vec4(aPosition, 0.0, 1.0);\n       }\n   ");
h(s.VERTEX_SHADER, "\n       precision highp float;\n   \n       attribute vec2 aPosition;\n       varying vec2 vUv;\n       varying vec2 vL;\n       varying vec2 vR;\n       uniform vec2 texelSize;\n   \n       void main () {\n           vUv = aPosition * 0.5 + 0.5;\n           float offset = 1.33333333;\n           vL = vUv - texelSize * offset;\n           vR = vUv + texelSize * offset;\n           gl_Position = vec4(aPosition, 0.0, 1.0);\n       }\n   "), h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying vec2 vUv;\n       varying vec2 vL;\n       varying vec2 vR;\n       uniform sampler2D uTexture;\n   \n       void main () {\n           vec4 sum = texture2D(uTexture, vUv) * 0.29411764;\n           sum += texture2D(uTexture, vL) * 0.35294117;\n           sum += texture2D(uTexture, vR) * 0.35294117;\n           gl_FragColor = sum;\n       }\n   ");
let g = h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying highp vec2 vUv;\n       uniform sampler2D uTexture;\n   \n       void main () {\n           gl_FragColor = texture2D(uTexture, vUv);\n       }\n   "),
    p = h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying highp vec2 vUv;\n       uniform sampler2D uTexture;\n       uniform float value;\n   \n       void main () {\n           gl_FragColor = value * texture2D(uTexture, vUv);\n       }\n   ");
h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n   \n       uniform vec4 color;\n   \n       void main () {\n           gl_FragColor = color;\n       }\n   ");
let y = h(s.FRAGMENT_SHADER, "\n       precision highp float;\n       precision highp sampler2D;\n   \n       varying vec2 vUv;\n       uniform sampler2D uTarget;\n       uniform float aspectRatio;\n       uniform vec3 color;\n       uniform vec2 point;\n       uniform float radius;\n   \n       void main () {\n           vec2 p = vUv - point.xy;\n           p.x *= aspectRatio;\n           vec3 splat = exp(-dot(p, p) / radius) * color;\n           vec3 base = texture2D(uTarget, vUv).xyz;\n           gl_FragColor = vec4(base + splat, 1.0);\n       }\n   "),
    b = h(s.FRAGMENT_SHADER, "\n       precision highp float;\n       precision highp sampler2D;\n   \n       varying vec2 vUv;\n       uniform sampler2D uVelocity;\n       uniform sampler2D uSource;\n       uniform vec2 texelSize;\n       uniform vec2 dyeTexelSize;\n       uniform float dt;\n       uniform float dissipation;\n   \n       vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n           vec2 st = uv / tsize - 0.5;\n   \n           vec2 iuv = floor(st);\n           vec2 fuv = fract(st);\n   \n           vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n           vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n           vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n           vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n   \n           return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n       }\n   \n       void main () {\n       #ifdef MANUAL_FILTERING\n           vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n           vec4 result = bilerp(uSource, coord, dyeTexelSize);\n       #else\n           vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n           vec4 result = texture2D(uSource, coord);\n       #endif\n           float decay = 1.0 + dissipation * dt;\n           gl_FragColor = result / decay;\n       }", c.supportLinearFiltering ? null : ["MANUAL_FILTERING"]),
    E = h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying highp vec2 vUv;\n       varying highp vec2 vL;\n       varying highp vec2 vR;\n       varying highp vec2 vT;\n       varying highp vec2 vB;\n       uniform sampler2D uVelocity;\n   \n       void main () {\n           float L = texture2D(uVelocity, vL).x;\n           float R = texture2D(uVelocity, vR).x;\n           float T = texture2D(uVelocity, vT).y;\n           float B = texture2D(uVelocity, vB).y;\n   \n           vec2 C = texture2D(uVelocity, vUv).xy;\n           if (vL.x < 0.0) { L = -C.x; }\n           if (vR.x > 1.0) { R = -C.x; }\n           if (vT.y > 1.0) { T = -C.y; }\n           if (vB.y < 0.0) { B = -C.y; }\n   \n           float div = 0.5 * (R - L + T - B);\n           gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n       }\n   "),
    T = h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying highp vec2 vUv;\n       varying highp vec2 vL;\n       varying highp vec2 vR;\n       varying highp vec2 vT;\n       varying highp vec2 vB;\n       uniform sampler2D uVelocity;\n   \n       void main () {\n           float L = texture2D(uVelocity, vL).y;\n           float R = texture2D(uVelocity, vR).y;\n           float T = texture2D(uVelocity, vT).x;\n           float B = texture2D(uVelocity, vB).x;\n           float vorticity = R - L - T + B;\n           gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n       }\n   "),
    R = h(s.FRAGMENT_SHADER, "\n       precision highp float;\n       precision highp sampler2D;\n   \n       varying vec2 vUv;\n       varying vec2 vL;\n       varying vec2 vR;\n       varying vec2 vT;\n       varying vec2 vB;\n       uniform sampler2D uVelocity;\n       uniform sampler2D uCurl;\n       uniform float curl;\n       uniform float dt;\n   \n       void main () {\n           float L = texture2D(uCurl, vL).x;\n           float R = texture2D(uCurl, vR).x;\n           float T = texture2D(uCurl, vT).x;\n           float B = texture2D(uCurl, vB).x;\n           float C = texture2D(uCurl, vUv).x;\n   \n           vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n           force /= length(force) + 0.0001;\n           force *= curl * C;\n           force.y *= -1.0;\n   \n           vec2 velocity = texture2D(uVelocity, vUv).xy;\n           velocity += force * dt;\n           velocity = min(max(velocity, -1000.0), 1000.0);\n           gl_FragColor = vec4(velocity, 0.0, 1.0);\n       }\n   "),
    w = h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying highp vec2 vUv;\n       varying highp vec2 vL;\n       varying highp vec2 vR;\n       varying highp vec2 vT;\n       varying highp vec2 vB;\n       uniform sampler2D uPressure;\n       uniform sampler2D uDivergence;\n   \n       void main () {\n           float L = texture2D(uPressure, vL).x;\n           float R = texture2D(uPressure, vR).x;\n           float T = texture2D(uPressure, vT).x;\n           float B = texture2D(uPressure, vB).x;\n           float C = texture2D(uPressure, vUv).x;\n           float divergence = texture2D(uDivergence, vUv).x;\n           float pressure = (L + R + B + T - divergence) * 0.25;\n           gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n       }\n   "),
    S = h(s.FRAGMENT_SHADER, "\n       precision mediump float;\n       precision mediump sampler2D;\n   \n       varying highp vec2 vUv;\n       varying highp vec2 vL;\n       varying highp vec2 vR;\n       varying highp vec2 vT;\n       varying highp vec2 vB;\n       uniform sampler2D uPressure;\n       uniform sampler2D uVelocity;\n   \n       void main () {\n           float L = texture2D(uPressure, vL).x;\n           float R = texture2D(uPressure, vR).x;\n           float T = texture2D(uPressure, vT).x;\n           float B = texture2D(uPressure, vB).x;\n           vec2 velocity = texture2D(uVelocity, vUv).xy;\n           velocity.xy -= vec2(R - L, T - B);\n           gl_FragColor = vec4(velocity, 0.0, 1.0);\n       }\n   "),
    D = (s.bindBuffer(s.ARRAY_BUFFER, s.createBuffer()), s.bufferData(s.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), s.STATIC_DRAW), s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, s.createBuffer()), s.bufferData(s.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), s.STATIC_DRAW), s.vertexAttribPointer(0, 2, s.FLOAT, !1, 0, 0), s.enableVertexAttribArray(0), function(e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        null == e ? (s.viewport(0, 0, s.drawingBufferWidth, s.drawingBufferHeight), s.bindFramebuffer(s.FRAMEBUFFER, null)) : (s.viewport(0, 0, e.width, e.height), s.bindFramebuffer(s.FRAMEBUFFER, e.fbo)), t && (s.clearColor(0, 0, 0, 1), s.clear(s.COLOR_BUFFER_BIT)), s.drawElements(s.TRIANGLES, 6, s.UNSIGNED_SHORT, 0)
    }),
    _ = new v(x, g),
    A = new v(x, p),
    N = new v(x, y),
    F = new v(x, b),
    U = new v(x, E),
    L = new v(x, T),
    j = new v(x, R),
    P = new v(x, w),
    C = new v(x, S),
    z = new d(x, "\n       precision highp float;\n       precision highp sampler2D;\n   \n       varying vec2 vUv;\n       varying vec2 vL;\n       varying vec2 vR;\n       varying vec2 vT;\n       varying vec2 vB;\n       uniform sampler2D uTexture;\n       uniform sampler2D uDithering;\n       uniform vec2 ditherScale;\n       uniform vec2 texelSize;\n   \n       vec3 linearToGamma (vec3 color) {\n           color = max(color, vec3(0));\n           return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));\n       }\n   \n       void main () {\n           vec3 c = texture2D(uTexture, vUv).rgb;\n   \n       #ifdef SHADING\n           vec3 lc = texture2D(uTexture, vL).rgb;\n           vec3 rc = texture2D(uTexture, vR).rgb;\n           vec3 tc = texture2D(uTexture, vT).rgb;\n           vec3 bc = texture2D(uTexture, vB).rgb;\n   \n           float dx = length(rc) - length(lc);\n           float dy = length(tc) - length(bc);\n   \n           vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n           vec3 l = vec3(0.0, 0.0, 1.0);\n   \n           float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n           c *= diffuse;\n       #endif\n   \n           float a = max(c.r, max(c.g, c.b));\n           gl_FragColor = vec4(c, a);\n       }\n   ");

function k() {
    let o = $(a.SIM_RESOLUTION),
        l = $(a.DYE_RESOLUTION),
        u = c.halfFloatTexType,
        d = c.formatRGBA,
        v = c.formatRG,
        m = c.formatR,
        f = c.supportLinearFiltering ? s.LINEAR : s.NEAREST;
    s.disable(s.BLEND), e = null == e ? I(l.width, l.height, d.internalFormat, d.format, u, f) : X(e, l.width, l.height, d.internalFormat, d.format, u, f), t = null == t ? I(o.width, o.height, v.internalFormat, v.format, u, f) : X(t, o.width, o.height, v.internalFormat, v.format, u, f), r = B(o.width, o.height, m.internalFormat, m.format, u, s.NEAREST), n = B(o.width, o.height, m.internalFormat, m.format, u, s.NEAREST), i = I(o.width, o.height, m.internalFormat, m.format, u, s.NEAREST)
}

function B(e, t, r, n, i, o) {
    s.activeTexture(s.TEXTURE0);
    let a = s.createTexture();
    s.bindTexture(s.TEXTURE_2D, a), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, o), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, o), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.CLAMP_TO_EDGE), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.CLAMP_TO_EDGE), s.texImage2D(s.TEXTURE_2D, 0, r, e, t, 0, n, i, null);
    let l = s.createFramebuffer();
    s.bindFramebuffer(s.FRAMEBUFFER, l), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, a, 0), s.viewport(0, 0, e, t), s.clear(s.COLOR_BUFFER_BIT);
    let c = 1 / e,
        u = 1 / t;
    return {
        texture: a,
        fbo: l,
        width: e,
        height: t,
        texelSizeX: c,
        texelSizeY: u,
        attach: e => (s.activeTexture(s.TEXTURE0 + e), s.bindTexture(s.TEXTURE_2D, a), e)
    }
}

function I(e, t, r, n, i, o) {
    let a = B(e, t, r, n, i, o),
        l = B(e, t, r, n, i, o);
    return {
        width: e,
        height: t,
        texelSizeX: a.texelSizeX,
        texelSizeY: a.texelSizeY,
        get read() {
            return a
        },
        set read(value) {
            a = value
        },
        get write() {
            return l
        },
        set write(value) {
            l = value
        },
        swap() {
            let e = a;
            a = l, l = e
        }
    }
}

function X(e, t, r, n, i, o, a) {
    var l;
    let c;
    return e.width == t && e.height == r || (e.read = (l = e.read, c = B(t, r, n, i, o, a), _.bind(), s.uniform1i(_.uniforms.uTexture, l.attach(0)), D(c), c), e.write = B(t, r, n, i, o, a), e.width = t, e.height = r, e.texelSizeX = 1 / t, e.texelSizeY = 1 / r), e
}! function() {
    let e = [];
    a.SHADING && e.push("SHADING"), z.setKeywords(e)
}(), k();
let M = Date.now(),
    O = 0;

function G() {
    var o, u, d;
    let v, m, f, h;
    let x = (m = Math.min(m = ((v = Date.now()) - M) / 1e3, .016666), M = v, m);
    Y() && k(), (O += x * a.COLOR_UPDATE_SPEED) >= 1 && (o = O, u = 0, d = 0, O = (o - u) % 1 + u, l.forEach(e => {
            e.color = q()
        })), l.forEach(e => {
            let t, r;
            e.moved && (e.moved = !1, t = e.deltaX * a.SPLAT_FORCE, r = e.deltaY * a.SPLAT_FORCE, H(e.texcoordX, e.texcoordY, t, r, e.color))
        }),
        function(o) {
            s.disable(s.BLEND), L.bind(), s.uniform2f(L.uniforms.texelSize, t.texelSizeX, t.texelSizeY), s.uniform1i(L.uniforms.uVelocity, t.read.attach(0)), D(n), j.bind(), s.uniform2f(j.uniforms.texelSize, t.texelSizeX, t.texelSizeY), s.uniform1i(j.uniforms.uVelocity, t.read.attach(0)), s.uniform1i(j.uniforms.uCurl, n.attach(1)), s.uniform1f(j.uniforms.curl, a.CURL), s.uniform1f(j.uniforms.dt, o), D(t.write), t.swap(), U.bind(), s.uniform2f(U.uniforms.texelSize, t.texelSizeX, t.texelSizeY), s.uniform1i(U.uniforms.uVelocity, t.read.attach(0)), D(r), A.bind(), s.uniform1i(A.uniforms.uTexture, i.read.attach(0)), s.uniform1f(A.uniforms.value, a.PRESSURE), D(i.write), i.swap(), P.bind(), s.uniform2f(P.uniforms.texelSize, t.texelSizeX, t.texelSizeY), s.uniform1i(P.uniforms.uDivergence, r.attach(0));
            for (let e = 0; e < a.PRESSURE_ITERATIONS; e++) s.uniform1i(P.uniforms.uPressure, i.read.attach(1)), D(i.write), i.swap();
            C.bind(), s.uniform2f(C.uniforms.texelSize, t.texelSizeX, t.texelSizeY), s.uniform1i(C.uniforms.uPressure, i.read.attach(0)), s.uniform1i(C.uniforms.uVelocity, t.read.attach(1)), D(t.write), t.swap(), F.bind(), s.uniform2f(F.uniforms.texelSize, t.texelSizeX, t.texelSizeY), c.supportLinearFiltering || s.uniform2f(F.uniforms.dyeTexelSize, t.texelSizeX, t.texelSizeY);
            let l = t.read.attach(0);
            s.uniform1i(F.uniforms.uVelocity, l), s.uniform1i(F.uniforms.uSource, l), s.uniform1f(F.uniforms.dt, o), s.uniform1f(F.uniforms.dissipation, a.VELOCITY_DISSIPATION), D(t.write), t.swap(), c.supportLinearFiltering || s.uniform2f(F.uniforms.dyeTexelSize, e.texelSizeX, e.texelSizeY), s.uniform1i(F.uniforms.uVelocity, t.read.attach(0)), s.uniform1i(F.uniforms.uSource, e.read.attach(1)), s.uniform1f(F.uniforms.dissipation, a.DENSITY_DISSIPATION), D(e.write), e.swap()
        }(x), s.blendFunc(s.ONE, s.ONE_MINUS_SRC_ALPHA), s.enable(s.BLEND), f = s.drawingBufferWidth, h = (0, s.drawingBufferHeight), z.bind(), a.SHADING && s.uniform2f(z.uniforms.texelSize, 1 / f, 1 / h), s.uniform1i(z.uniforms.uTexture, e.read.attach(0)), D(null), requestAnimationFrame(G)
}

function Y() {
    let e = K(o.clientWidth),
        t = K(o.clientHeight);
    return (o.width != e || o.height != t) && (o.width = e, o.height = t, !0)
}

function H(r, n, i, l, c) {
    var u;
    let d;
    N.bind(), s.uniform1i(N.uniforms.uTarget, t.read.attach(0)), s.uniform1f(N.uniforms.aspectRatio, o.width / o.height), s.uniform2f(N.uniforms.point, r, n), s.uniform3f(N.uniforms.color, i, l, 0), s.uniform1f(N.uniforms.radius, (u = a.SPLAT_RADIUS / 100, (d = o.width / o.height) > 1 && (u *= d), u)), D(t.write), t.swap(), s.uniform1i(N.uniforms.uTarget, e.read.attach(0)), s.uniform3f(N.uniforms.color, c.r, c.g, c.b), D(e.write), e.swap()
}

function V(e, t, r, n) {
    e.id = t, e.down = !0, e.moved = !1, e.texcoordX = r / o.width, e.texcoordY = 1 - n / o.height, e.prevTexcoordX = e.texcoordX, e.prevTexcoordY = e.texcoordY, e.deltaX = 0, e.deltaY = 0, e.color = q()
}

function W(e, t, r, n) {
    var i, a;
    let l, s;
    e.prevTexcoordX = e.texcoordX, e.prevTexcoordY = e.texcoordY, e.texcoordX = t / o.width, e.texcoordY = 1 - r / o.height, e.deltaX = (i = e.texcoordX - e.prevTexcoordX, (l = o.width / o.height) < 1 && (i *= l), i), e.deltaY = (a = e.texcoordY - e.prevTexcoordY, (s = o.width / o.height) > 1 && (a /= s), a), e.moved = Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0, e.color = n
}

function q() {
    let e = function(e, t, r) {
        let n, i, o, a, l, s, c;
        switch (a = Math.floor(6 * e), s = 1 * (1 - 1 * (l = 6 * e - a)), c = r * (1 - (1 - l) * t), a % 6) {
            case 0:
                n = r, i = c, o = 0;
                break;
            case 1:
                n = s, i = r, o = 0;
                break;
            case 2:
                n = 0, i = r, o = c;
                break;
            case 3:
                n = 0, i = s, o = r;
                break;
            case 4:
                n = c, i = 0, o = r;
                break;
            case 5:
                n = r, i = 0, o = s
        }
        return {
            r: n,
            g: i,
            b: o
        }
    }(Math.random(), 1, 1);
    return e.r *= .15, e.g *= .15, e.b *= .15, e
}

function $(e) {
    let t = s.drawingBufferWidth / s.drawingBufferHeight;
    t < 1 && (t = 1 / t);
    let r = Math.round(e),
        n = Math.round(e * t);
    return s.drawingBufferWidth > s.drawingBufferHeight ? {
        width: n,
        height: r
    } : {
        width: r,
        height: n
    }
}

function K(e) {
    return Math.floor(e * (window.devicePixelRatio || 1))
}
window.addEventListener("mousedown", e => {
    let t = l[0];
    V(t, -1, K(e.clientX), K(e.clientY)),
        function(e) {
            let t = q();
            t.r *= 10, t.g *= 10, t.b *= 10;
            let r = 10 * (Math.random() - .5),
                n = 30 * (Math.random() - .5);
            H(e.texcoordX, e.texcoordY, r, n, t)
        }(t)
}), document.body.addEventListener("mousemove", function e(t) {
    let r = l[0],
        n = K(t.clientX),
        i = K(t.clientY),
        o = q();
    G(), W(r, n, i, o), document.body.removeEventListener("mousemove", e)
}), window.addEventListener("mousemove", e => {
    let t = l[0],
        r = K(e.clientX),
        n = K(e.clientY),
        i = t.color;
    W(t, r, n, i)
}), document.body.addEventListener("touchstart", function e(t) {
    let r = t.targetTouches,
        n = l[0];
    for (let e = 0; e < r.length; e++) {
        let t = K(r[e].clientX),
            i = K(r[e].clientY);
        G(), V(n, r[e].identifier, t, i)
    }
    document.body.removeEventListener("touchstart", e)
}), window.addEventListener("touchstart", e => {
    let t = e.targetTouches,
        r = l[0];
    for (let e = 0; e < t.length; e++) {
        let n = K(t[e].clientX),
            i = K(t[e].clientY);
        V(r, t[e].identifier, n, i)
    }
}), window.addEventListener("touchmove", e => {
    let t = e.targetTouches,
        r = l[0];
    for (let e = 0; e < t.length; e++) W(r, K(t[e].clientX), K(t[e].clientY), r.color)
}, !1), window.addEventListener("touchend", e => {
    let t = e.changedTouches,
        r = l[0];
    for (let e = 0; e < t.length; e++) r.down = !1
})
                

// Start immediately and keep the surface alive. The reference implementation starts on first pointer move;
// for this portfolio we seed continuous low-force splats so the liquid never becomes static.
function seedSplat(multiplier) {
    let color = q();
    color.r *= 3.1; color.g *= 3.1; color.b *= 3.1;
    let clock = Date.now() * 0.001;
    let px = 0.18 + 0.38 * (0.5 + 0.5 * Math.sin(clock * 0.37 + Math.random() * 2.0));
    let py = 0.58 + 0.30 * (0.5 + 0.5 * Math.cos(clock * 0.31 + Math.random() * 2.0));
    let dx = (Math.sin(clock * 1.7 + Math.random() * 4.0) * 18 + 8) * multiplier;
    let dy = (Math.cos(clock * 1.25 + Math.random() * 4.0) * 22 - 4) * multiplier;
    H(px, py, dx, dy, color);
}

for (let seedIndex = 0; seedIndex < 14; seedIndex++) {
    setTimeout(() => seedSplat(0.95), 80 + seedIndex * 70);
}
setInterval(() => seedSplat(0.42), 520);
window.sristiFluidBurst = function() {
    for (let burstIndex = 0; burstIndex < 9; burstIndex++) {
        setTimeout(() => seedSplat(1.35), burstIndex * 34);
    }
};
G();

}
initReferenceFluid();


const screenEl = document.querySelector('[data-screen]');
const domDisplace = document.querySelector('#dom-displace');
function runFluidTransition(callback) {
  screenEl?.classList.add('is-transitioning');
  window.sristiFluidBurst?.();
  let start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / 820);
    const wave = Math.sin(t * Math.PI);
    if (domDisplace) domDisplace.setAttribute('scale', String((wave * 32).toFixed(2)));
    if (t < 1) requestAnimationFrame(frame);
    else {
      if (domDisplace) domDisplace.setAttribute('scale', '0');
      screenEl?.classList.remove('is-transitioning');
    }
  }
  requestAnimationFrame(frame);
  setTimeout(callback, 260);
}

// Gemini chat UI
const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-input]');
const chat = document.querySelector('[data-chat]');
const closeBtn = document.querySelector('[data-close]');
const messages = document.querySelector('[data-messages]');
const chatForm = document.querySelector('[data-chat-form]');
const chatInput = document.querySelector('[data-chat-input]');
const chatHistory = [];
const fallbackAnswers = {
  me: 'Sristi is a Computer Science Engineering student at Lovely Professional University. Her CV shows a foundation in programming, web technologies, databases, Git/GitHub, Figma, and practical application development.',
  projects: 'Sristi has two featured academic projects: Census Management System and Expense Tracker. Census Management System focuses on centralized citizen/population records, a structured database, search, record management, and CRUD operations. Expense Tracker is a Python application with CRUD functionality, SQL aggregate queries, real-time spending totals, category-wise breakdowns, and database testing.',
  skills: 'Programming: Python, C, C++. Web: HTML, CSS. Databases and tools: MySQL, MongoDB, Git, GitHub, Figma. Soft skills: Problem Solving, Team Collaboration, Time Management, Adaptability.',
  certifications: 'Sristi has six certifications: Cloud Infrastructure: Describe Cloud Concepts by Microsoft, Generative AI by Microsoft, SQL Advanced by HackerRank, Introduction to Artificial Intelligence by Infosys, Python For Data Science by Infosys, and Introduction to Python for Data Science by upGrad.',
  education: 'Education: B.Tech in Computer Science and Engineering at Lovely Professional University with CGPA 8.42, Higher Secondary Education at Kendriya Vidyalaya No. 1 with 74%, and Secondary Education at Kendriya Vidyalaya No. 1 with 80%.',
  contact: 'You can contact Sristi at sristi15343296@gmail.com. GitHub: github.com/sristi15343296. LinkedIn: linkedin.com/in/sristi104.',
  achievements: 'Sristi has solved more than 100 programming problems on online coding platforms and conducted a Cybersecurity Awareness Session for school students as part of CDP.'
};

// Certificate gallery and lightbox
const certModal = document.querySelector('[data-cert-modal]');
const certClose = document.querySelector('[data-cert-close]');
const certLightbox = document.querySelector('[data-cert-lightbox]');
const lightboxImg = document.querySelector('[data-lightbox-img]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
function openCertModal(){
  runFluidTransition(() => {
    certModal.hidden = false;
    certModal.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>certModal.classList.add('open'));
  });
}
function closeCertModal(){
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden','true');
  setTimeout(()=>{certModal.hidden=true},240);
}
function openCertLightbox(src,title){
  lightboxImg.src = src;
  lightboxImg.alt = title;
  lightboxCaption.textContent = title;
  certLightbox.hidden = false;
  certLightbox.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>certLightbox.classList.add('open'));
}
function closeCertLightbox(){
  certLightbox.classList.remove('open');
  certLightbox.setAttribute('aria-hidden','true');
  setTimeout(()=>{certLightbox.hidden=true; lightboxImg.src='';},240);
}
certClose?.addEventListener('click', closeCertModal);
certModal?.addEventListener('click', e=>{ if(e.target===certModal) closeCertModal(); });
document.querySelectorAll('[data-cert-src]').forEach(card=>card.addEventListener('click',()=>openCertLightbox(card.dataset.certSrc, card.dataset.certTitle || 'Certificate')));
lightboxClose?.addEventListener('click', closeCertLightbox);
certLightbox?.addEventListener('click', e=>{ if(e.target===certLightbox) closeCertLightbox(); });

function localTopic(q=''){q=q.toLowerCase();if(/project|work|built|census|expense|github/.test(q))return'projects';if(/skill|language|tech|tool|python|html|css|mysql|mongo|figma|git/.test(q))return'skills';if(/cert|microsoft|hackerrank|infosys|upgrad|sql|ai|cloud/.test(q))return'certifications';if(/education|cgpa|school|college|university|bachelor|percentage/.test(q))return'education';if(/contact|email|linkedin|phone|reach/.test(q))return'contact';if(/achieve|problem|coding|cyber|cdp/.test(q))return'achievements';return'me'}
function openChat(){chat.hidden=false;chat.setAttribute('aria-hidden','false');requestAnimationFrame(()=>chat.classList.add('open'));setTimeout(()=>chatInput?.focus(),260)}
function closeChat(){runFluidTransition(()=>{chat.classList.remove('open');chat.setAttribute('aria-hidden','true');setTimeout(()=>{chat.hidden=true},240)})}
function esc(v){return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')}
function formatAnswer(text){const lines=esc(text.trim()).split('\n').filter(Boolean);let html='',list=false;for(const line of lines){const c=line.trim();if(/^[-*•]\s+/.test(c)){if(!list){html+='<ul>';list=true}html+=`<li>${c.replace(/^[-*•]\s+/,'')}</li>`}else{if(list){html+='</ul>';list=false}html+=`<p>${c.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</p>`}}if(list)html+='</ul>';return html||'<p>No answer returned.</p>'}
function addMessage(content,who='bot',isHtml=false){const node=document.createElement('div');node.className=`message ${who}`;node.innerHTML=isHtml?content:esc(content);messages.appendChild(node);messages.scrollTop=messages.scrollHeight;return node}
async function askGemini(question){const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,history:chatHistory.slice(-6)})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'AI unavailable');return data.answer}
async function ask(question){const clean=question.trim()||'Tell me about Sristi';runFluidTransition(()=>openChat());setTimeout(()=>{addMessage(clean,'user');const typing=addMessage('<span class="typing"><span></span><span></span><span></span></span>','bot',true);askGemini(clean).then(answer=>{typing.innerHTML=formatAnswer(answer);chatHistory.push({role:'user',text:clean},{role:'model',text:answer})}).catch(()=>{typing.innerHTML=formatAnswer(`${fallbackAnswers[localTopic(clean)]}\n\nNote: Gemini is not connected yet. Add GEMINI_API_KEY to enable real AI responses.`)}).finally(()=>{messages.scrollTop=messages.scrollHeight})},300)}
document.querySelectorAll('[data-question]').forEach(btn=>btn.addEventListener('click',()=>{const q=btn.dataset.question||'Tell me about Sristi';if(input)input.value=q;if(btn.hasAttribute('data-certs')){openCertModal();return;}ask(q)}));
form?.addEventListener('submit',e=>{e.preventDefault();ask(input?.value||'Tell me about Sristi')});
chatForm?.addEventListener('submit',e=>{e.preventDefault();const q=chatInput?.value||'';if(!q.trim())return;chatInput.value='';ask(q)});
closeBtn?.addEventListener('click',closeChat);chat?.addEventListener('click',e=>{if(e.target===chat)closeChat()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(certLightbox?.classList.contains('open')) closeCertLightbox(); else if(certModal?.classList.contains('open')) closeCertModal(); else if(chat?.classList.contains('open')) closeChat();}});
