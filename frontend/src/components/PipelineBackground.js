import React, { useEffect, useRef } from "react";

import "../scss/components/PipelineBackground.scss";

export default function PipelineBackground() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const { PI, cos, sin, abs, round, random } = Math;
        const HALF_PI = 0.5 * PI;
        const TAU = 2 * PI;
        const TO_RAD = PI / 180;
        const rand = (n) => n * random();

        const fadeInOut = (t, m) => {
            let hm = 0.5 * m;
            return abs(((t + hm) % m) - hm) / hm;
        };

        const pipeCount = 70;
        const pipePropCount = 20;
        const pipePropsLength = pipeCount * pipePropCount;
        const turnCount = 4;
        const turnAmount = (360 / turnCount) * TO_RAD;
        const turnChanceRange = 100;
        const baseSpeed = 1;
        const rangeSpeed = 0;
        const baseTTL = 100;
        const rangeTTL = 300;
        const baseWidth = 3;
        const rangeWidth = 5;
        const baseHue = 250;
        const rangeHue = 150;
        const backgroundColor = "rgb(0, 0, 0)";
        const cycleDuration = 10000;
        const pauseTime = 500;

        let canvas = {
            a: document.createElement("canvas"),
            b: document.createElement("canvas"),
        };
        let ctx = {
            a: canvas.a.getContext("2d"),
            b: canvas.b.getContext("2d"),
        };
        let center = [];
        let tick = 0;
        let pipeProps;
        let startTime;

        function initPipes() {
            pipeProps = new Float32Array(pipePropsLength);
            for (let i = 0; i < pipePropsLength; i += pipePropCount) {
                initPipe(i);
            }
        }

        function initPipe(i) {
            let x = rand(canvas.a.width);
            let y = center[1];
            let direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
            let speed = baseSpeed + rand(rangeSpeed);
            let life = 0;
            let ttl = baseTTL + rand(rangeTTL);
            let width = baseWidth + rand(rangeWidth);
            let hue = baseHue + rand(rangeHue);

            pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
        }

        function updatePipes() {
            tick++;
            for (let i = 0; i < pipePropsLength; i += pipePropCount) {
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
            let x = pipeProps[i];
            let y = pipeProps[i2];
            let direction = pipeProps[i3];
            let speed = pipeProps[i4];
            let life = pipeProps[i5];
            let ttl = pipeProps[i6];
            let width = pipeProps[i7];
            let hue = pipeProps[i8];

            drawPipe(x, y, life, ttl, width, hue);

            life++;
            x += cos(direction) * speed;
            y += sin(direction) * speed;
            let turnChance =
                !(tick % round(rand(turnChanceRange))) &&
                (!(round(x) % 6) || !(round(y) % 6));
            let turnBias = round(rand(1)) ? -1 : 1;
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
            ctx.a.strokeStyle = `rgb(255,20,147,${fadeInOut(life, ttl) * 0.2})`;
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

        function render() {
            ctx.b.save();
            ctx.b.fillStyle = backgroundColor;
            ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
            ctx.b.restore();

            ctx.b.save();
            ctx.b.filter = "blur(8px)";
            ctx.b.drawImage(canvas.a, 0, 0);
            ctx.b.restore();

            ctx.b.save();
            ctx.b.drawImage(canvas.a, 0, 0);
            ctx.b.restore();
        }

        function resize() {
            const { innerWidth, innerHeight } = window;
            canvas.a.width = innerWidth;
            canvas.a.height = innerHeight;
            canvas.b.width = innerWidth;
            canvas.b.height = innerHeight;
            center[0] = 0.5 * canvas.a.width;
            center[1] = 0.5 * canvas.a.height;
        }

        function resetAnimation() {
            ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
            ctx.b.clearRect(0, 0, canvas.b.width, canvas.b.height);
            ctx.a.fillStyle = backgroundColor;
            ctx.a.fillRect(0, 0, canvas.a.width, canvas.a.height);
            ctx.b.fillStyle = backgroundColor;
            ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
            tick = 0;
            initPipes();
            startTime = performance.now();
            draw();
        }

        function draw() {
            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;

            if (elapsedTime >= cycleDuration) {
                setTimeout(resetAnimation, pauseTime);
                return;
            }

            updatePipes();
            render();
            animationRef.current = requestAnimationFrame(draw);
        }

        // Setup
        function setup() {
            const container = canvasRef.current;
            container.appendChild(canvas.b);
            canvas.b.style = "width: 100%;";

            resize();
            initPipes();
            startTime = performance.now();
            draw();
        }

        setup();

        const handleResize = () => {
            resize();
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        const canv = canvasRef.current;
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (canv && canvas.b.parentNode === canv) {
                canv.removeChild(canvas.b);
            }
        };

    }, []);




    return <div className="content content--canvas" ref={canvasRef} >

        </div>;
}
