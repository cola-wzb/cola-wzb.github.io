// 粒子网络特效 - 适用于Hexo博客
(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'particle-net';
    canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:-1;';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    var mouseX = null, mouseY = null;

    // 可自定义参数
    var config = {
        particleCount: 60,      // 粒子数量
        lineDistance: 150,      // 连线最大距离（像素）
        particleColor: '85,136,170', // RGB颜色（默认蓝色调，可修改）
        pointRadius: 1.5,       // 粒子半径
        lineWidth: 0.5,         // 线条粗细
        speed: 0.5              // 移动速度
    };

    // 初始化粒子
    function init() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        particles = [];
        for (var i = 0; i < config.particleCount; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed
            });
        }
    }

    // 绘制一帧
    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(' + config.particleColor + ', 0.2)';
        ctx.lineWidth = config.lineWidth;

        // 更新粒子位置
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            // 边界反弹（或环绕，这里用反弹）
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            // 确保不超出边界
            p.x = Math.min(Math.max(p.x, 0), W);
            p.y = Math.min(Math.max(p.y, 0), H);
        }

        // 绘制粒子之间的连线
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var p1 = particles[i];
                var p2 = particles[j];
                var dx = p1.x - p2.x;
                var dy = p1.y - p2.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < config.lineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // 绘制粒子点
        ctx.fillStyle = 'rgba(' + config.particleColor + ', 0.6)';
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, config.pointRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    // 鼠标交互（可选）：粒子靠近鼠标时略微吸引
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    window.addEventListener('mouseout', function() {
        mouseX = null;
        mouseY = null;
    });

    // 重设尺寸
    window.addEventListener('resize', function() {
        init();
    });

    // 启动
    init();
    draw();

    // 可自定义颜色：在HTML标签上设置 data-color 属性
    var script = document.currentScript || document.querySelector('script[src*="particle-net.js"]');
    if (script) {
        var color = script.getAttribute('data-color');
        if (color) config.particleColor = color;
    }
})();