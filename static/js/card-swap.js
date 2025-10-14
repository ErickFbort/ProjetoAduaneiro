/**
 * CardSwap - Vanilla JavaScript implementation
 * Animated card swapping component using GSAP
 */

class CardSwap {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            cardDistance: 80,
            verticalDistance: 90,
            delay: 5000,
            pauseOnHover: false,
            skewAmount: 8,
            easing: 'elastic',
            width: 450,
            height: 320,
            ...options
        };
        
        this.cards = [];
        this.order = [];
        this.timeline = null;
        this.interval = null;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('CardSwap: Container not found');
            return;
        }
        
        // Load GSAP if not already loaded
        this.loadGSAP().then(() => {
            this.setupCards();
            this.startAnimation();
            this.setupEventListeners();
        });
    }
    
    async loadGSAP() {
        if (window.gsap) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setupCards() {
        // Get all terminal cards
        const terminalCards = this.container.querySelectorAll('.terminal-card');
        
        if (terminalCards.length === 0) {
            console.warn('CardSwap: No terminal cards found');
            return;
        }
        
        // Create card swap container if it doesn't exist
        let cardSwapContainer = this.container.querySelector('.card-swap-container');
        if (!cardSwapContainer) {
            cardSwapContainer = document.createElement('div');
            cardSwapContainer.className = 'card-swap-container';
            this.container.appendChild(cardSwapContainer);
        }
        
        // Clone and prepare cards
        terminalCards.forEach((card, index) => {
            const clonedCard = card.cloneNode(true);
            clonedCard.className = 'card-swap-card';
            clonedCard.style.display = 'block';
            clonedCard.style.width = this.options.width + 'px';
            clonedCard.style.height = this.options.height + 'px';
            
            cardSwapContainer.appendChild(clonedCard);
            this.cards.push(clonedCard);
            this.order.push(index);
        });
        
        // Hide original cards
        terminalCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Position cards initially
        this.positionCards();
    }
    
    positionCards() {
        this.cards.forEach((card, index) => {
            const slot = this.makeSlot(index, this.options.cardDistance, this.options.verticalDistance, this.cards.length);
            this.placeCard(card, slot, this.options.skewAmount);
        });
    }
    
    makeSlot(index, distX, distY, total) {
        return {
            x: index * distX,
            y: -index * distY,
            z: -index * distX * 1.5,
            zIndex: total - index
        };
    }
    
    placeCard(card, slot, skew) {
        gsap.set(card, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            xPercent: -50,
            yPercent: -50,
            skewY: skew,
            transformOrigin: 'center center',
            zIndex: slot.zIndex,
            force3D: true
        });
    }
    
    startAnimation() {
        if (this.cards.length < 2) return;
        
        this.swap();
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.swap();
            }
        }, this.options.delay);
    }
    
    swap() {
        if (this.order.length < 2) return;
        
        const [front, ...rest] = this.order;
        const frontCard = this.cards[front];
        
        const config = this.getAnimationConfig();
        const timeline = gsap.timeline();
        
        // Drop front card
        timeline.to(frontCard, {
            y: '+=500',
            duration: config.durDrop,
            ease: config.ease
        });
        
        // Promote other cards
        timeline.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
        
        rest.forEach((cardIndex, i) => {
            const card = this.cards[cardIndex];
            const slot = this.makeSlot(i, this.options.cardDistance, this.options.verticalDistance, this.cards.length);
            
            timeline.set(card, { zIndex: slot.zIndex }, 'promote');
            timeline.to(card, {
                x: slot.x,
                y: slot.y,
                z: slot.z,
                duration: config.durMove,
                ease: config.ease
            }, `promote+=${i * 0.15}`);
        });
        
        // Return front card to back
        const backSlot = this.makeSlot(this.cards.length - 1, this.options.cardDistance, this.options.verticalDistance, this.cards.length);
        timeline.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
        
        timeline.call(() => {
            gsap.set(frontCard, { zIndex: backSlot.zIndex });
        }, undefined, 'return');
        
        timeline.to(frontCard, {
            x: backSlot.x,
            y: backSlot.y,
            z: backSlot.z,
            duration: config.durReturn,
            ease: config.ease
        }, 'return');
        
        // Update order
        timeline.call(() => {
            this.order = [...rest, front];
        });
        
        this.timeline = timeline;
    }
    
    getAnimationConfig() {
        if (this.options.easing === 'elastic') {
            return {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 2,
                durMove: 2,
                durReturn: 2,
                promoteOverlap: 0.9,
                returnDelay: 0.05
            };
        } else {
            return {
                ease: 'power1.inOut',
                durDrop: 0.8,
                durMove: 0.8,
                durReturn: 0.8,
                promoteOverlap: 0.45,
                returnDelay: 0.2
            };
        }
    }
    
    setupEventListeners() {
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => {
                this.pause();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.resume();
            });
        }
        
        // Add click handlers to cards
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.onCardClick(index);
            });
        });
    }
    
    pause() {
        this.isPaused = true;
        if (this.timeline) {
            this.timeline.pause();
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    
    resume() {
        this.isPaused = false;
        if (this.timeline) {
            this.timeline.play();
        }
        this.startAnimation();
    }
    
    onCardClick(index) {
        console.log('Card clicked:', index);
        // You can add custom click handling here
        // For example, open a modal or navigate to terminal details
        const terminalCodes = ['CWB', 'GYN', 'REC', 'VIX', 'NVT'];
        if (terminalCodes[index]) {
            viewTerminalDetails(terminalCodes[index]);
        }
    }
    
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.timeline) {
            this.timeline.kill();
        }
        this.cards.forEach(card => card.remove());
    }
}

// Initialize CardSwap when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const terminalsSection = document.querySelector('.terminals-section');
    if (terminalsSection) {
        window.cardSwap = new CardSwap(terminalsSection, {
            cardDistance: 80,
            verticalDistance: 90,
            delay: 4000,
            pauseOnHover: true,
            easing: 'elastic',
            width: 450,
            height: 320
        });
    }
});

// Export for global access
window.CardSwap = CardSwap;
