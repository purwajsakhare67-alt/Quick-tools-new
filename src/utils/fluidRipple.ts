/**
 * Tap Drop & Fluid Ripple System (Micro-Interactions)
 * Vanilla JavaScript click/tap listener rendering a clean, high-performance
 * CSS radial-gradient expand ripple wave (Water Drop Effect) originating
 * precisely from the user's cursor click / touch coordinates.
 */
export function initFluidRippleSystem(): () => void {
  const handlePointerDown = (e: PointerEvent) => {
    // Only primary click/touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Match all grid cards, category tabs, interactive buttons, or elements marked with ripple
    const rippleTarget = target.closest<HTMLElement>(
      '.cyber-glass-card, button, [role="button"], .tab-btn, .ripple-trigger, a'
    );

    if (!rippleTarget) return;

    // Do not trigger inside text inputs or textareas
    const tagName = target.tagName;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const rect = rippleTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate expanding diameter to cover the card/element completely
    const diameter = Math.max(rect.width, rect.height) * 2;
    const radius = diameter / 2;

    const ripple = document.createElement('span');
    ripple.className = 'fluid-ripple-wave';
    ripple.style.width = `${diameter}px`;
    ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x - radius}px`;
    ripple.style.top = `${y - radius}px`;

    // Ensure relative positioning and boundary overflow clipping
    const computedPosition = window.getComputedStyle(rippleTarget).position;
    if (computedPosition === 'static') {
      rippleTarget.style.position = 'relative';
    }
    const computedOverflow = window.getComputedStyle(rippleTarget).overflow;
    if (computedOverflow !== 'hidden') {
      rippleTarget.style.overflow = 'hidden';
    }

    rippleTarget.appendChild(ripple);

    // Auto-remove on animation end or fallback timer
    const cleanRipple = () => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    };

    ripple.addEventListener('animationend', cleanRipple, { once: true });
    setTimeout(cleanRipple, 650);
  };

  document.addEventListener('pointerdown', handlePointerDown, { passive: true });

  return () => {
    document.removeEventListener('pointerdown', handlePointerDown);
  };
}
