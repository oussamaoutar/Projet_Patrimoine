// Animation des motifs géométriques pour la section zellige
class GeometricPattern {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            numShapes: 20,
            minSize: 30,
            maxSize: 100,
            colors: ['#1a5276', '#d35400', '#f1c40f', '#2c3e50', '#ecf0f1'],
            minOpacity: 0.05,
            maxOpacity: 0.15,
            animationDuration: {min: 5, max: 15}
        }, options);
        
        this.shapes = [];
        this.init();
    }
    
    init() {
        const containerRect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < this.options.numShapes; i++) {
            this.createShape(containerRect);
        }
    }
    
    createShape(containerRect) {
        const shape = document.createElement('div');
        const size = this.randomBetween(this.options.minSize, this.options.maxSize);
        const type = this.randomChoice(['square', 'triangle', 'circle', 'star', 'hexagon']);
        const color = this.randomChoice(this.options.colors);
        const opacity = this.randomBetween(this.options.minOpacity, this.options.maxOpacity);
        const x = this.randomBetween(0, containerRect.width - size);
        const y = this.randomBetween(0, containerRect.height - size);
        const rotation = this.randomBetween(0, 360);
        const duration = this.randomBetween(this.options.animationDuration.min, this.options.animationDuration.max);
        const delay = this.randomBetween(0, 5);
        
        shape.classList.add('geometric-shape', type);
        shape.style.position = 'absolute';
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.backgroundColor = color;
        shape.style.opacity = opacity;
        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;
        shape.style.transform = `rotate(${rotation}deg)`;
        shape.style.transition = `transform ${duration}s ease-in-out, opacity ${duration/2}s ease-in-out`;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationIterationCount = 'infinite';
        shape.style.animationDirection = 'alternate';
        shape.style.animationTimingFunction = 'ease-in-out';
        
        if (type === 'triangle') {
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.borderLeft = `${size/2}px solid transparent`;
            shape.style.borderRight = `${size/2}px solid transparent`;
            shape.style.borderBottom = `${size}px solid ${color}`;
            shape.style.backgroundColor = 'transparent';
        } else if (type === 'circle') {
            shape.style.borderRadius = '50%';
        } else if (type === 'star') {
            shape.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        } else if (type === 'hexagon') {
            shape.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        }
        
        // Animation
        shape.style.animationName = this.randomChoice(['float', 'pulse', 'spin']);
        
        this.container.appendChild(shape);
        this.shapes.push(shape);
        
        // Add event listeners for interactive effects
        shape.addEventListener('mouseover', () => {
            shape.style.opacity = opacity * 2;
            shape.style.transform = `rotate(${rotation + 45}deg) scale(1.2)`;
        });
        
        shape.addEventListener('mouseout', () => {
            shape.style.opacity = opacity;
            shape.style.transform = `rotate(${rotation}deg) scale(1)`;
        });
    }
    
    randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }
    
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// 3D Zellige Pattern Viewer
class ZelligePatternViewer {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.patterns = [
            'octagon-star', 
            'hexagon-triangle', 
            'square-diamond', 
            'pentagon-star',
            'complex-arabesque'
        ];
        this.currentPattern = 0;
        this.rotation = 0;
        this.scale = 1;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.init();
    }
    
    init() {
        // Set up canvas
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = 400;
        this.container.appendChild(this.canvas);
        
        // Add controls
        this.createControls();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial draw
        this.draw();
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.classList.add('pattern-controls');
        
        // Pattern selector
        const selector = document.createElement('div');
        selector.classList.add('pattern-selector');
        
        this.patterns.forEach((pattern, index) => {
            const button = document.createElement('button');
            button.textContent = this.formatPatternName(pattern);
            button.classList.add('pattern-button');
            if (index === this.currentPattern) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.currentPattern = index;
                document.querySelectorAll('.pattern-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.draw();
            });
            
            selector.appendChild(button);
        });
        
        // Zoom controls
        const zoomControls = document.createElement('div');
        zoomControls.classList.add('zoom-controls');
        
        const zoomIn = document.createElement('button');
        zoomIn.textContent = '+';
        zoomIn.addEventListener('click', () => {
            this.scale *= 1.2;
            this.draw();
        });
        
        const zoomOut = document.createElement('button');
        zoomOut.textContent = '-';
        zoomOut.addEventListener('click', () => {
            this.scale /= 1.2;
            this.draw();
        });
        
        const resetView = document.createElement('button');
        resetView.textContent = 'Reset';
        resetView.addEventListener('click', () => {
            this.rotation = 0;
            this.scale = 1;
            this.draw();
        });
        
        zoomControls.appendChild(zoomOut);
        zoomControls.appendChild(resetView);
        zoomControls.appendChild(zoomIn);
        
        controls.appendChild(selector);
        controls.appendChild(zoomControls);
        
        this.container.appendChild(controls);
    }
    
    addEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.lastX;
            const deltaY = e.clientY - this.lastY;
            
            this.rotation += deltaX * 0.01;
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.draw();
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (e.deltaY < 0) {
                this.scale *= 1.1;
            } else {
                this.scale /= 1.1;
            }
            
            this.draw();
        });
        
        window.addEventListener('resize', () => {
            this.canvas.width = this.container.offsetWidth;
            this.draw();
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.rotation);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw the current pattern
        this.drawPattern(this.patterns[this.currentPattern]);
        
        this.ctx.restore();
    }
    
    drawPattern(patternType) {
        switch(patternType) {
            case 'octagon-star':
                this.drawOctagonStarPattern();
                break;
            case 'hexagon-triangle':
                this.drawHexagonTrianglePattern();
                break;
            case 'square-diamond':
                this.drawSquareDiamondPattern();
                break;
            case 'pentagon-star':
                this.drawPentagonStarPattern();
                break;
            case 'complex-arabesque':
                this.drawComplexArabesquePattern();
                break;
        }
    }
    
    drawOctagonStarPattern() {
        const size = 50;
        const gridSize = 5;
        const startX = -size * gridSize;
        const startY = -size * gridSize;
        
        for (let x = 0; x < gridSize * 2; x++) {
            for (let y = 0; y < gridSize * 2; y++) {
                const posX = startX + x * size * 2;
                const posY = startY + y * size * 2;
                
                // Draw octagon
                this.ctx.fillStyle = '#1a5276';
                this.drawOctagon(posX, posY, size);
                
                // Draw star
                this.ctx.fillStyle = '#d35400';
                this.drawStar(posX, posY, size * 0.8, 8);
            }
        }
    }
    
    drawHexagonTrianglePattern() {
        const size = 40;
        const gridSize = 6;
        const startX = -size * gridSize;
        const startY = -size * gridSize;
        
        for (let x = 0; x < gridSize * 2; x++) {
            for (let y = 0; y < gridSize * 2; y++) {
                const posX = startX + x * size * 1.5;
                const posY = startY + y * size * Math.sqrt(3);
                
                // Offset every other row
                const offset = y % 2 === 0 ? 0 : size * 0.75;
                
                // Draw hexagon
                this.ctx.fillStyle = '#2c3e50';
                this.drawHexagon(posX + offset, posY, size);
                
                // Draw triangles
                this.ctx.fillStyle = '#f1c40f';
                this.drawTriangle(posX + offset, posY, size * 0.6);
            }
        }
    }
    
    drawSquareDiamondPattern() {
        const size = 45;
        const gridSize = 6;
        const startX = -size * gridSize;
        const startY = -size * gridSize;
        
        for (let x = 0; x < gridSize * 2; x++) {
            for (let y = 0; y < gridSize * 2; y++) {
                const posX = startX + x * size;
                const posY = startY + y * size;
                
                // Draw square
                this.ctx.fillStyle = '#ecf0f1';
                this.ctx.fillRect(posX - size/2, posY - size/2, size, size);
                
                // Draw diamond
                this.ctx.fillStyle = '#d35400';
                this.drawDiamond(posX, posY, size * 0.7);
            }
        }
    }
    
    drawPentagonStarPattern() {
        const size = 50;
        const gridSize = 5;
        const startX = -size * gridSize;
        const startY = -size * gridSize;
        
        for (let x = 0; x < gridSize * 2; x++) {
            for (let y = 0; y < gridSize * 2; y++) {
                const posX = startX + x * size * 1.5;
                const posY = startY + y * size * 1.5;
                
                // Draw pentagon
                this.ctx.fillStyle = '#1a5276';
                this.drawPentagon(posX, posY, size);
                
                // Draw star
                this.ctx.fillStyle = '#f1c40f';
                this.drawStar(posX, posY, size * 0.6, 5);
            }
        }
    }
    
    drawComplexArabesquePattern() {
        const size = 100;
        const gridSize = 3;
        const startX = -size * gridSize;
        const startY = -size * gridSize;
        
        for (let x = 0; x < gridSize * 2; x++) {
            for (let y = 0; y < gridSize * 2; y++) {
                const posX = startX + x * size;
                const posY = startY + y * size;
                
                // Draw complex arabesque
                this.drawArabesque(posX, posY, size);
            }
        }
    }
    
    // Shape drawing helpers
    drawOctagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawStar(x, y, size, points = 5) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = i * Math.PI / points;
            const radius = i % 2 === 0 ? size : size * 0.4;
            const px = x + radius * Math.cos(angle - Math.PI / 2);
            const py = y + radius * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawHexagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawTriangle(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = i * (2 * Math.PI / 3);
            const px = x + size * Math.cos(angle - Math.PI / 2);
            const py = y + size * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawDiamond(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x + size/2, y);
        this.ctx.lineTo(x, y + size/2);
        this.ctx.lineTo(x - size/2, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawPentagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = i * (2 * Math.PI / 5);
            const px = x + size * Math.cos(angle - Math.PI / 2);
            const py = y + size * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawArabesque(x, y, size) {
        // Base circle
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner pattern
        this.ctx.fillStyle = '#1a5276';
        
        // Draw 8-fold symmetry pattern
        for (let i = 0; i < 8; i++) {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(i * Math.PI / 4);
            
            // Draw petal shape
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.bezierCurveTo(size * 0.2, size * 0.2, size * 0.5, size * 0.3, size * 0.7, 0);
            this.ctx.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.2, -size * 0.2, 0, 0);
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        // Center star
        this.ctx.fillStyle = '#d35400';
        this.drawStar(x, y, size * 0.3, 8);
    }
    
    formatPatternName(name) {
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Plâtre Sculpté 3D Viewer
class PlatreViewer {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.patterns = [
            'geometric', 
            'floral', 
            'epigraphic', 
            'muqarnas',
            'combined'
        ];
        this.currentPattern = 0;
        this.rotation = 0;
        this.scale = 1;
        this.lightAngle = 0;
        this.lightIntensity = 0.8;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.init();
    }
    
    init() {
        // Set up canvas
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = 400;
        this.container.appendChild(this.canvas);
        
        // Add controls
        this.createControls();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial draw
        this.draw();
        
        // Start light animation
        this.animateLight();
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.classList.add('pattern-controls');
        
        // Pattern selector
        const selector = document.createElement('div');
        selector.classList.add('pattern-selector');
        
        this.patterns.forEach((pattern, index) => {
            const button = document.createElement('button');
            button.textContent = this.formatPatternName(pattern);
            button.classList.add('pattern-button');
            if (index === this.currentPattern) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.currentPattern = index;
                document.querySelectorAll('.pattern-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.draw();
            });
            
            selector.appendChild(button);
        });
        
        // Light controls
        const lightControls = document.createElement('div');
        lightControls.classList.add('light-controls');
        
        const lightSlider = document.createElement('input');
        lightSlider.type = 'range';
        lightSlider.min = '0';
        lightSlider.max = '1';
        lightSlider.step = '0.1';
        lightSlider.value = this.lightIntensity;
        lightSlider.addEventListener('input', (e) => {
            this.lightIntensity = parseFloat(e.target.value);
            this.draw();
        });
        
        const lightLabel = document.createElement('label');
        lightLabel.textContent = 'Light';
        
        lightControls.appendChild(lightLabel);
        lightControls.appendChild(lightSlider);
        
        controls.appendChild(selector);
        controls.appendChild(lightControls);
        
        this.container.appendChild(controls);
    }
    
    addEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.lastX;
            
            this.rotation += deltaX * 0.01;
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.draw();
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        window.addEventListener('resize', () => {
            this.canvas.width = this.container.offsetWidth;
            this.draw();
        });
    }
    
    animateLight() {
        this.lightAngle += 0.02;
        this.draw();
        requestAnimationFrame(() => this.animateLight());
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.rotation);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw the current pattern
        this.drawPattern(this.patterns[this.currentPattern]);
        
        this.ctx.restore();
    }
    
    drawPattern(patternType) {
        switch(patternType) {
            case 'geometric':
                this.drawGeometricPattern();
                break;
            case 'floral':
                this.drawFloralPattern();
                break;
            case 'epigraphic':
                this.drawEpigraphicPattern();
                break;
            case 'muqarnas':
                this.drawMuqarnasPattern();
                break;
            case 'combined':
                this.drawCombinedPattern();
                break;
        }
    }
    
    // Pattern drawing methods with 3D lighting effects
    drawGeometricPattern() {
        const size = 200;
        const depth = 20;
        
        // Base rectangle
        this.drawShadedRectangle(0, 0, size, size, depth, '#ecf0f1');
        
        // Geometric pattern
        const gridSize = 4;
        const cellSize = size / gridSize;
        
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const posX = -size/2 + x * cellSize + cellSize/2;
                const posY = -size/2 + y * cellSize + cellSize/2;
                
                if ((x + y) % 2 === 0) {
                    this.drawShadedStar(posX, posY, cellSize * 0.4, 8, depth * 0.7, '#ecf0f1');
                } else {
                    this.drawShadedOctagon(posX, posY, cellSize * 0.4, depth * 0.7, '#ecf0f1');
                }
            }
        }
    }
    
    drawFloralPattern() {
        const size = 200;
        const depth = 20;
        
        // Base rectangle
        this.drawShadedRectangle(0, 0, size, size, depth, '#ecf0f1');
        
        // Central flower
        this.drawShadedFlower(0, 0, size * 0.4, depth * 0.8, '#ecf0f1');
        
        // Corner flowers
        const cornerDist = size * 0.35;
        this.drawShadedFlower(-cornerDist, -cornerDist, size * 0.2, depth * 0.6, '#ecf0f1');
        this.drawShadedFlower(cornerDist, -cornerDist, size * 0.2, depth * 0.6, '#ecf0f1');
        this.drawShadedFlower(-cornerDist, cornerDist, size * 0.2, depth * 0.6, '#ecf0f1');
        this.drawShadedFlower(cornerDist, cornerDist, size * 0.2, depth * 0.6, '#ecf0f1');
        
        // Connecting vines
        this.drawShadedVine(0, 0, -cornerDist, -cornerDist, depth * 0.4, '#ecf0f1');
        this.drawShadedVine(0, 0, cornerDist, -cornerDist, depth * 0.4, '#ecf0f1');
        this.drawShadedVine(0, 0, -cornerDist, cornerDist, depth * 0.4, '#ecf0f1');
        this.drawShadedVine(0, 0, cornerDist, cornerDist, depth * 0.4, '#ecf0f1');
    }
    
    drawEpigraphicPattern() {
        const size = 200;
        const depth = 20;
        
        // Base rectangle
        this.drawShadedRectangle(0, 0, size, size, depth, '#ecf0f1');
        
        // Calligraphic border
        this.drawShadedRectangle(0, 0, size * 0.8, size * 0.8, depth * 0.5, '#ecf0f1');
        
        // Simulate Arabic calligraphy
        this.drawShadedCalligraphy(0, 0, size * 0.7, depth * 0.7, '#ecf0f1');
    }
    
    drawMuqarnasPattern() {
        const size = 200;
        const depth = 30;
        
        // Base rectangle
        this.drawShadedRectangle(0, 0, size, size, depth, '#ecf0f1');
        
        // Muqarnas cells
        this.drawMuqarnasCells(0, 0, size * 0.8, depth, '#ecf0f1');
    }
    
    drawCombinedPattern() {
        const size = 200;
        const depth = 25;
        
        // Base rectangle
        this.drawShadedRectangle(0, 0, size, size, depth, '#ecf0f1');
        
        // Geometric border
        this.drawShadedRectangle(0, 0, size * 0.9, size * 0.9, depth * 0.7, '#ecf0f1');
        
        // Central star
        this.drawShadedStar(0, 0, size * 0.3, 8, depth * 0.8, '#ecf0f1');
        
        // Floral corners
        const cornerDist = size * 0.3;
        this.drawShadedFlower(-cornerDist, -cornerDist, size * 0.15, depth * 0.6, '#ecf0f1');
        this.drawShadedFlower(cornerDist, -cornerDist, size * 0.15, depth * 0.6, '#ecf0f1');
        this.drawShadedFlower(-cornerDist, cornerDist, size * 0.15, depth * 0.6, '#ecf0f1');
        this.drawShadedFlower(cornerDist, cornerDist, size * 0.15, depth * 0.6, '#ecf0f1');
        
        // Calligraphic band
        this.drawShadedCalligraphyBand(0, -size * 0.2, size * 0.6, depth * 0.5, '#ecf0f1');
    }
    
    // 3D shaded drawing helpers
    drawShadedRectangle(x, y, width, height, depth, color) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        // Calculate lighting
        const lightX = Math.cos(this.lightAngle);
        const lightY = Math.sin(this.lightAngle);
        
        // Top face
        this.ctx.fillStyle = this.shadedColor(color, 1);
        this.ctx.fillRect(x - halfWidth, y - halfHeight, width, height);
        
        // Left face if visible
        if (lightX > 0) {
            this.ctx.fillStyle = this.shadedColor(color, 0.7);
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfWidth, y - halfHeight);
            this.ctx.lineTo(x - halfWidth - depth, y - halfHeight + depth);
            this.ctx.lineTo(x - halfWidth - depth, y + halfHeight + depth);
            this.ctx.lineTo(x - halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        // Right face if visible
        if (lightX < 0) {
            this.ctx.fillStyle = this.shadedColor(color, 0.7);
            this.ctx.beginPath();
            this.ctx.moveTo(x + halfWidth, y - halfHeight);
            this.ctx.lineTo(x + halfWidth + depth, y - halfHeight + depth);
            this.ctx.lineTo(x + halfWidth + depth, y + halfHeight + depth);
            this.ctx.lineTo(x + halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        // Bottom face if visible
        if (lightY < 0) {
            this.ctx.fillStyle = this.shadedColor(color, 0.5);
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfWidth, y + halfHeight);
            this.ctx.lineTo(x - halfWidth - depth, y + halfHeight + depth);
            this.ctx.lineTo(x + halfWidth + depth, y + halfHeight + depth);
            this.ctx.lineTo(x + halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        // Top face if visible
        if (lightY > 0) {
            this.ctx.fillStyle = this.shadedColor(color, 0.5);
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfWidth, y - halfHeight);
            this.ctx.lineTo(x - halfWidth - depth, y - halfHeight + depth);
            this.ctx.lineTo(x + halfWidth + depth, y - halfHeight + depth);
            this.ctx.lineTo(x + halfWidth, y - halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    drawShadedStar(x, y, size, points, depth, color) {
        // Draw base
        this.ctx.fillStyle = this.shadedColor(color, 0.8);
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = i * Math.PI / points;
            const radius = i % 2 === 0 ? size : size * 0.4;
            const px = x + radius * Math.cos(angle - Math.PI / 2);
            const py = y + radius * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw sides with shadow
        this.ctx.fillStyle = this.shadedColor(color, 0.6);
        this.ctx.beginPath();
        
        for (let i = 0; i < points * 2; i++) {
            const angle = i * Math.PI / points;
            const nextAngle = ((i + 1) % (points * 2)) * Math.PI / points;
            
            const radius = i % 2 === 0 ? size : size * 0.4;
            const nextRadius = (i + 1) % 2 === 0 ? size : size * 0.4;
            
            const px = x + radius * Math.cos(angle - Math.PI / 2);
            const py = y + radius * Math.sin(angle - Math.PI / 2);
            
            const nx = x + nextRadius * Math.cos(nextAngle - Math.PI / 2);
            const ny = y + nextRadius * Math.sin(nextAngle - Math.PI / 2);
            
            const lightAngleDiff = Math.abs(((angle - this.lightAngle) % (2 * Math.PI)));
            if (lightAngleDiff > Math.PI / 2 && lightAngleDiff < 3 * Math.PI / 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(px, py + depth);
                this.ctx.lineTo(nx, ny + depth);
                this.ctx.lineTo(nx, ny);
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
    }
    
    drawShadedOctagon(x, y, size, depth, color) {
        // Draw base
        this.ctx.fillStyle = this.shadedColor(color, 0.8);
        this.ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw sides with shadow
        this.ctx.fillStyle = this.shadedColor(color, 0.6);
        
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const nextAngle = ((i + 1) % 8) * Math.PI / 4;
            
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            
            const nx = x + size * Math.cos(nextAngle);
            const ny = y + size * Math.sin(nextAngle);
            
            const lightAngleDiff = Math.abs(((angle - this.lightAngle) % (2 * Math.PI)));
            if (lightAngleDiff > Math.PI / 2 && lightAngleDiff < 3 * Math.PI / 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(px, py + depth);
                this.ctx.lineTo(nx, ny + depth);
                this.ctx.lineTo(nx, ny);
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
    }
    
    drawShadedFlower(x, y, size, depth, color) {
        // Draw petals
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const px = x + size * 0.7 * Math.cos(angle);
            const py = y + size * 0.7 * Math.sin(angle);
            
            this.ctx.fillStyle = this.shadedColor(color, 0.7 + 0.3 * Math.sin(angle - this.lightAngle));
            this.ctx.beginPath();
            this.ctx.ellipse(px, py, size * 0.4, size * 0.2, angle, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw center
        this.ctx.fillStyle = this.shadedColor(color, 0.9);
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw center shadow
        this.ctx.fillStyle = this.shadedColor(color, 0.6);
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + depth * 0.3, size * 0.3, size * 0.1, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawShadedVine(x1, y1, x2, y2, depth, color) {
        const controlX = (x1 + x2) / 2 + (y2 - y1) * 0.3;
        const controlY = (y1 + y2) / 2 + (x1 - x2) * 0.3;
        
        // Draw main vine
        this.ctx.strokeStyle = this.shadedColor(color, 0.7);
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(controlX, controlY, x2, y2);
        this.ctx.stroke();
        
        // Draw shadow
        this.ctx.strokeStyle = this.shadedColor(color, 0.4);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1 + depth * 0.5);
        this.ctx.quadraticCurveTo(controlX, controlY + depth * 0.5, x2, y2 + depth * 0.5);
        this.ctx.stroke();
        
        // Draw leaves
        const numLeaves = 3;
        for (let i = 1; i <= numLeaves; i++) {
            const t = i / (numLeaves + 1);
            const leafX = x1 + (x2 - x1) * t + (controlX - (x1 + (x2 - x1) * t)) * (1 - t) * 2;
            const leafY = y1 + (y2 - y1) * t + (controlY - (y1 + (y2 - y1) * t)) * (1 - t) * 2;
            
            const angle = Math.atan2(y2 - y1, x2 - x1) + (i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2);
            
            this.drawShadedLeaf(leafX, leafY, depth * 0.8, angle, color);
        }
    }
    
    drawShadedLeaf(x, y, depth, angle, color) {
        const size = 10;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        
        // Draw leaf
        this.ctx.fillStyle = this.shadedColor(color, 0.8);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(size, size, size * 2, size, size * 3, 0);
        this.ctx.bezierCurveTo(size * 2, -size, size, -size, 0, 0);
        this.ctx.fill();
        
        // Draw shadow
        this.ctx.fillStyle = this.shadedColor(color, 0.5);
        this.ctx.beginPath();
        this.ctx.moveTo(0, depth * 0.3);
        this.ctx.bezierCurveTo(size, size + depth * 0.3, size * 2, size + depth * 0.3, size * 3, depth * 0.3);
        this.ctx.bezierCurveTo(size * 2, -size + depth * 0.3, size, -size + depth * 0.3, 0, depth * 0.3);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawShadedCalligraphy(x, y, size, depth, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Simulate Arabic calligraphy with curves
        this.ctx.fillStyle = this.shadedColor(color, 0.8);
        
        // Horizontal base line
        this.ctx.fillRect(-size/2, -5, size, 10);
        
        // Vertical strokes
        for (let i = -4; i <= 4; i += 2) {
            const height = 30 + Math.random() * 40;
            const xPos = (i / 4) * size/2;
            
            this.ctx.fillRect(xPos - 5, -height, 10, height);
            
            // Add shadow
            this.ctx.fillStyle = this.shadedColor(color, 0.5);
            this.ctx.fillRect(xPos - 5, 0, 10, depth);
            this.ctx.fillStyle = this.shadedColor(color, 0.8);
        }
        
        // Curved elements
        for (let i = -3; i <= 3; i += 2) {
            const xPos = (i / 3) * size/2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, 0);
            this.ctx.quadraticCurveTo(xPos + 30, -40, xPos + 60, 0);
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = this.shadedColor(color, 0.8);
            this.ctx.stroke();
            
            // Add shadow
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, depth);
            this.ctx.quadraticCurveTo(xPos + 30, -40 + depth, xPos + 60, depth);
            this.ctx.lineWidth = 6;
            this.ctx.strokeStyle = this.shadedColor(color, 0.5);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawShadedCalligraphyBand(x, y, width, depth, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Background band
        this.ctx.fillStyle = this.shadedColor(color, 0.7);
        this.ctx.fillRect(-width/2, -15, width, 30);
        
        // Shadow
        this.ctx.fillStyle = this.shadedColor(color, 0.4);
        this.ctx.fillRect(-width/2, 15, width, depth);
        
        // Simulated text
        this.ctx.fillStyle = this.shadedColor(color, 0.9);
        for (let i = -width/2 + 20; i < width/2 - 20; i += 15) {
            const height = 5 + Math.random() * 15;
            this.ctx.fillRect(i, -height/2, 5, height);
        }
        
        this.ctx.restore();
    }
    
    drawMuqarnasCells(x, y, size, depth, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        
        const rows = 3;
        const cellsPerRow = [3, 5, 7];
        
        for (let row = 0; row < rows; row++) {
            const rowY = -size/2 + row * (size/rows);
            const cellWidth = size / cellsPerRow[row];
            
            for (let cell = 0; cell < cellsPerRow[row]; cell++) {
                const cellX = -size/2 + cell * cellWidth + cellWidth/2;
                const cellDepth = depth * (1 - row/rows);
                
                // Draw cell
                this.drawMuqarnasCell(cellX, rowY, cellWidth * 0.9, size/rows, cellDepth, color, row);
            }
        }
        
        this.ctx.restore();
    }
    
    drawMuqarnasCell(x, y, width, height, depth, color, type) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        // Calculate lighting
        const lightX = Math.cos(this.lightAngle);
        const lightY = Math.sin(this.lightAngle);
        
        if (type === 0) {
            // Square cell
            this.ctx.fillStyle = this.shadedColor(color, 0.9);
            this.ctx.fillRect(x - halfWidth, y, width, height);
            
            // Bottom face
            this.ctx.fillStyle = this.shadedColor(color, 0.6);
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfWidth, y + height);
            this.ctx.lineTo(x - halfWidth, y + height + depth);
            this.ctx.lineTo(x + halfWidth, y + height + depth);
            this.ctx.lineTo(x + halfWidth, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Side faces
            if (lightX > 0) {
                this.ctx.fillStyle = this.shadedColor(color, 0.7);
                this.ctx.beginPath();
                this.ctx.moveTo(x - halfWidth, y);
                this.ctx.lineTo(x - halfWidth, y + height + depth);
                this.ctx.lineTo(x - halfWidth, y + height);
                this.ctx.lineTo(x - halfWidth, y);
                this.ctx.closePath();
                this.ctx.fill();
            }
            
            if (lightX < 0) {
                this.ctx.fillStyle = this.shadedColor(color, 0.7);
                this.ctx.beginPath();
                this.ctx.moveTo(x + halfWidth, y);
                this.ctx.lineTo(x + halfWidth, y + height + depth);
                this.ctx.lineTo(x + halfWidth, y + height);
                this.ctx.lineTo(x + halfWidth, y);
                this.ctx.closePath();
                this.ctx.fill();
            }
        } else if (type === 1) {
            // Triangular cell
            this.ctx.fillStyle = this.shadedColor(color, 0.9);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - halfWidth, y + height);
            this.ctx.lineTo(x + halfWidth, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Bottom face
            this.ctx.fillStyle = this.shadedColor(color, 0.6);
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfWidth, y + height);
            this.ctx.lineTo(x - halfWidth, y + height + depth);
            this.ctx.lineTo(x + halfWidth, y + height + depth);
            this.ctx.lineTo(x + halfWidth, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Side faces
            this.ctx.fillStyle = this.shadedColor(color, 0.7);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + depth);
            this.ctx.lineTo(x - halfWidth, y + height + depth);
            this.ctx.lineTo(x - halfWidth, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + depth);
            this.ctx.lineTo(x + halfWidth, y + height + depth);
            this.ctx.lineTo(x + halfWidth, y + height);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            // Rhombus cell
            this.ctx.fillStyle = this.shadedColor(color, 0.9);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - halfWidth, y + halfHeight);
            this.ctx.lineTo(x, y + height);
            this.ctx.lineTo(x + halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Bottom face
            this.ctx.fillStyle = this.shadedColor(color, 0.6);
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfWidth, y + halfHeight);
            this.ctx.lineTo(x - halfWidth, y + halfHeight + depth);
            this.ctx.lineTo(x, y + height + depth);
            this.ctx.lineTo(x, y + height);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + height);
            this.ctx.lineTo(x, y + height + depth);
            this.ctx.lineTo(x + halfWidth, y + halfHeight + depth);
            this.ctx.lineTo(x + halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Side faces
            this.ctx.fillStyle = this.shadedColor(color, 0.7);
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + depth);
            this.ctx.lineTo(x - halfWidth, y + halfHeight + depth);
            this.ctx.lineTo(x - halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + depth);
            this.ctx.lineTo(x + halfWidth, y + halfHeight + depth);
            this.ctx.lineTo(x + halfWidth, y + halfHeight);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    shadedColor(baseColor, intensity) {
        // Apply lighting intensity
        const adjustedIntensity = intensity * this.lightIntensity;
        
        // Parse the base color
        let r, g, b;
        if (baseColor.startsWith('#')) {
            const hex = baseColor.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            // Default to white if color format is not recognized
            r = g = b = 255;
        }
        
        // Apply lighting
        r = Math.round(r * adjustedIntensity);
        g = Math.round(g * adjustedIntensity);
        b = Math.round(b * adjustedIntensity);
        
        // Ensure values are in valid range
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    formatPatternName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}

// Initialize interactive elements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create geometric patterns for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new GeometricPattern(heroSection);
    }
    
    // Create zellige pattern viewer
    const zelligeSection = document.getElementById('zellige');
    if (zelligeSection) {
        const viewerContainer = document.createElement('div');
        viewerContainer.classList.add('pattern-viewer-container');
        viewerContainer.innerHTML = '<h3>Explorez les motifs du zellige</h3><p>Interagissez avec les motifs traditionnels du zellige marocain</p>';
        zelligeSection.querySelector('.container').appendChild(viewerContainer);
        
        new ZelligePatternViewer(viewerContainer);
    }
    
    // Create plâtre pattern viewer
    const platreSection = document.getElementById('platre');
    if (platreSection) {
        const viewerContainer = document.createElement('div');
        viewerContainer.classList.add('pattern-viewer-container');
        viewerContainer.innerHTML = '<h3>Découvrez les reliefs du plâtre sculpté</h3><p>Explorez les différents styles de motifs du gebs marocain</p>';
        platreSection.querySelector('.container').appendChild(viewerContainer);
        
        new PlatreViewer(viewerContainer);
    }
    
    // Add CSS for the new interactive elements
    const style = document.createElement('style');
    style.textContent = `
        .geometric-shape {
            pointer-events: auto;
            z-index: 1;
        }
        
        @keyframes float {
            0% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        @keyframes spin {
            0% { transform: rotate(0); }
            100% { transform: rotate(360deg); }
        }
        
        .pattern-viewer-container {
            margin: 3rem 0;
            padding: 1rem;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: var(--border-radius);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .pattern-viewer-container h3 {
            text-align: center;
            margin-bottom: 0.5rem;
        }
        
        .pattern-viewer-container p {
            text-align: center;
            margin-bottom: 1.5rem;
            color: var(--secondary-color);
        }
        
        .pattern-controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .pattern-selector {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
            margin-bottom: 1rem;
        }
        
        .pattern-button {
            padding: 0.5rem 1rem;
            background-color: var(--light-color);
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all var(--transition-speed) ease;
        }
        
        .pattern-button.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .zoom-controls, .light-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .zoom-controls button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background-color: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-speed) ease;
        }
        
        .zoom-controls button:hover {
            background-color: var(--secondary-color);
        }
        
        canvas {
            display: block;
            margin: 0 auto;
            cursor: grab;
            border-radius: var(--border-radius);
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        canvas:active {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(style);
});
