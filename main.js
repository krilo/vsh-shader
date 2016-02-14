import GLSL from './assets/glsl';

view Main {

  on.mount(() => {

    var img = new Image();
    img.onload = function () {
      buildScene()
    };
    img.src = './assets/02_lookbook_01_left.jpg';

    function buildScene(){

      /**
       * Set Canvas size
       */
      var canvas = document.getElementById("viewport");
      canvas.width = img.width;
      canvas.height = img.height;

      var glsl = new GLSL({
        canvas: canvas,
        fragment: `
          #ifdef GL_ES
          precision mediump float;
          #endif

          uniform float time;
          uniform vec2 resolution;
          uniform sampler2D logo;

          float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
          }

          void main (void) {

            vec4 fragColor;
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec2 uv_org = vec2(uv);
            float t = mod(time/10000000000., 36.0);
            float t2 = floor(t*.6);
            float x,y,yt,xt;

            yt = abs(cos(t)) * rand(vec2(t,t)) * 100.0;
            xt = sin(360.0*rand(vec2(t,t)))*0.25;
            if (xt < 0.0) {
              xt = 0.125;
            }

            x = uv.x-xt*exp(-pow(uv.y*100.0-yt,2.0)/24.0);
            y = uv.y;
            uv.x = x;
            uv.y = y;

            yt = 0.5*cos((yt/100.0)/100.0*360.0);
            float yr = 0.1*cos((yt/100.0)/100.0*360.0);

            if (uv_org.y > yt && uv_org.y < yt+rand(vec2(t2,t))*0.25) {
              float md = mod(x*100.0,10.0);

              if (md*sin(t) > sin(yr*360.0) || rand(vec2(md,md))>0.4) {
                vec4 org_c = texture2D(logo, uv);
                float colx = rand(vec2(t2,t2)) * 0.75;
                float coly = rand(vec2(uv.x+t,t));// * 0.5;
                float colz = rand(vec2(t2,t2));// * 0.5;
                //fragColor = vec4(org_c.x + colx, org_c.y + colx, org_c.z + colx ,0.0);
              }

            } else if (y<cos(t) && mod(x*40.0,2.0)>rand(vec2(y*t,t*t))*1.0 ||  mod(y*12.0,2.0)<rand(vec2(x,t))*1.0) {

              if (rand(vec2(x+t,y+t))>0.8) {
                fragColor = texture2D(logo, uv);
                //fragColor = vec4(rand(vec2(x*t,y*t)),rand(vec2(x*t,y*t)),rand(vec2(x*t,y*t)),0.0);
              } else {
               fragColor = texture2D(logo, uv);
              }

            } else {
              uv.x = uv.x + rand(vec2(t,uv.y)) * 0.0087 * sin(y*2.0);
              fragColor = texture2D(logo, uv);
            }

            gl_FragColor = fragColor;
          }

        `,
        variables: {
          time: 0,
          logo: img
        },
        update: function (time) {
          this.set("time", time);
        }
      }).start();
    }

  })

  <canvas id="viewport" />

  $canvas = {
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }

  $ = {
    background: '#010101',
    width: '100%',
    height: '100%',
    display: 'block',
    position: 'absolute'
  }

}
