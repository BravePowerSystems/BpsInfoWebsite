export default function PipelineBackground() {
    const { PI, cos, sin, abs, round, random } = Math;
    const HALF_PI = 0.5 * PI;
    const TAU = 2 * PI;
    const TO_RAD = PI / 180;
    const rand = (n) => n * random();

    const fadeInOut = (t, m) => {
        let hm = 0.5 * m;
        return abs(((t + hm) % m) - hm) / hm;
    };
    const pipeCount = 80;
    const pipePropCount = 20;
    const pipePropsLength = pipeCount * pipePropCount;
    const turnCount = 4;
    const turnAmount = (360 / turnCount) * TO_RAD;
    const turnChanceRange = 100;
    const baseSpeed = 0.5;
    const rangeSpeed = 1;
    const baseTTL = 100;
    const rangeTTL = 300;
    const baseWidth = 3;
    const rangeWidth = 5;
    const baseHue = 180;
    const rangeHue = 60;
    const backgroundColor = "rgb(0, 0, 0)";

    // Animation cycle duration in milliseconds (20 seconds)
    const cycleDuration = 10000;
    let container;
    let canvas;
    let ctx;
    let center;
    let tick;
    let pipeProps;
    let animationId;
    let startTime;
    let pauseTime = 500; // Half second pause before restarting

    function setup() {
        createCanvas();
        resize();
        initPipes();
        startTime = performance.now();
        draw();
    }

    function resetAnimation() {
        // Cancel the current animation frame
        window.cancelAnimationFrame(animationId);

        // Clear both canvases completely
        ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
        ctx.b.clearRect(0, 0, canvas.b.width, canvas.b.height);

        // Fill with background color to ensure complete reset
        ctx.a.fillStyle = backgroundColor;
        ctx.a.fillRect(0, 0, canvas.a.width, canvas.a.height);
        ctx.b.fillStyle = backgroundColor;
        ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);

        // Reset animation state
        tick = 0;
        initPipes();

        // Set new start time
        startTime = performance.now();

        // Restart the animation
        animationId = window.requestAnimationFrame(draw);
    }

    function initPipes() {
        pipeProps = new Float32Array(pipePropsLength);

        let i;

        for (i = 0; i < pipePropsLength; i += pipePropCount) {
            initPipe(i);
        }
    }

    function initPipe(i) {
        let x, y, direction, speed, life, ttl, width, hue;

        x = rand(canvas.a.width);
        y = center[1];
        direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
        speed = baseSpeed + rand(rangeSpeed);
        life = 0;
        ttl = baseTTL + rand(rangeTTL);
        width = baseWidth + rand(rangeWidth);
        hue = baseHue + rand(rangeHue);

        pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
    }

    function updatePipes() {
        tick++;

        let i;

        for (i = 0; i < pipePropsLength; i += pipePropCount) {
            updatePipe(i);
        }
    }

    function updatePipe(i) {
        let i2 = 1 + i,
            i3 = 2 + i,
            i4 = 3 + i,
            i5 = 4 + i,
            i6 = 5 + i,
            i7 = 6 + i,
            i8 = 7 + i;
        let x, y, direction, speed, life, ttl, width, hue, turnChance, turnBias;

        x = pipeProps[i];
        y = pipeProps[i2];
        direction = pipeProps[i3];
        speed = pipeProps[i4];
        life = pipeProps[i5];
        ttl = pipeProps[i6];
        width = pipeProps[i7];
        hue = pipeProps[i8];

        drawPipe(x, y, life, ttl, width, hue);

        life++;
        x += cos(direction) * speed;
        y += sin(direction) * speed;
        turnChance =
            !(tick % round(rand(turnChanceRange))) &&
            (!(round(x) % 6) || !(round(y) % 6));
        turnBias = round(rand(1)) ? -1 : 1;
        direction += turnChance ? turnAmount * turnBias : 0;

        pipeProps[i] = x;
        pipeProps[i2] = y;
        pipeProps[i3] = direction;
        pipeProps[i5] = life;

        checkBounds(x, y);
        life > ttl && initPipe(i);
    }

    function drawPipe(x, y, life, ttl, width, hue) {
        ctx.a.save();
        ctx.a.strokeStyle = `hsla(${hue},100%,50%,${
            fadeInOut(life, ttl) * 0.125
        })`;
        ctx.a.beginPath();
        ctx.a.arc(x, y, width, 0, TAU);
        ctx.a.stroke();
        ctx.a.closePath();
        ctx.a.restore();
    }

    function checkBounds(x, y) {
        if (x > canvas.a.width) x = 0;
        if (x < 0) x = canvas.a.width;
        if (y > canvas.a.height) y = 0;
        if (y < 0) y = canvas.a.height;
    }

    function createCanvas() {
        container = document.querySelector(".content--canvas");
        canvas = {
            a: document.createElement("canvas"),
            b: document.createElement("canvas"),
        };

        container.appendChild(canvas.b);
        canvas.b.style = `
        width: 100%;
        `;
        ctx = {
            a: canvas.a.getContext("2d"),
            b: canvas.b.getContext("2d"),
        };
        center = [];
        tick = 0;
    }

    function resize() {
        const { innerWidth, innerHeight } = window;

        canvas.a.width = innerWidth;
        canvas.a.height = innerHeight;

        ctx.a.drawImage(canvas.b, 0, 0);

        canvas.b.width = innerWidth;
        canvas.b.height = innerHeight;

        ctx.b.drawImage(canvas.a, 0, 0);

        center[0] = 0.5 * canvas.a.width;
        center[1] = 0.5 * canvas.a.height;
    }

    function render() {
        ctx.b.save();
        ctx.b.fillStyle = backgroundColor;
        ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
        ctx.b.restore();

        ctx.b.save();
        ctx.b.filter = "blur(12px)";
        ctx.b.drawImage(canvas.a, 0, 0);
        ctx.b.restore();

        ctx.b.save();
        ctx.b.drawImage(canvas.a, 0, 0);
        ctx.b.restore();
    }

    function draw(timestamp) {
        // Check if we've reached the cycle duration
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= cycleDuration) {
            // Schedule reset after a brief pause
            setTimeout(() => {
                resetAnimation();
            }, pauseTime);
            return;
        }

        updatePipes();
        render();

        animationId = window.requestAnimationFrame(draw);
    }

    window.addEventListener("load", setup);
    window.addEventListener("resize", resize);

    // Clean up event listeners and animation when component unmounts
    const cleanup = () => {
        window.removeEventListener("load", setup);
        window.removeEventListener("resize", resize);
        if (animationId) {
            
            window.cancelAnimationFrame(animationId);
        }
    };

    return <div className="content content--canvas">
    </div>;
}
