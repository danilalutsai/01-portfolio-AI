import { gsap } from 'gsap';

// Pointer-driven effects shared by pages. Each function returns a cleanup,
// so it can be returned straight from a gsap.matchMedia() handler.

// The optional `[data-pointer-glow]` element that trails the pointer.
function createGlow(container: HTMLElement) {
  const element = container.querySelector<HTMLElement>('[data-pointer-glow]');
  if (!element) return null;

  const x = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power3.out' });
  const y = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power3.out' });
  gsap.set(element, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

  return {
    moveTo(left: number, top: number) {
      x(left);
      y(top);
    },
    show: () => gsap.to(element, { autoAlpha: 1, duration: 0.4 }),
    hide: () => gsap.to(element, { autoAlpha: 0, duration: 0.4 }),
  };
}

/**
 * Moves every `[data-parallax="<depth>"]` element inside the container with the
 * pointer, by up to `depth` pixels. Negative depths move against the pointer.
 * An optional `[data-pointer-glow]` element follows the pointer exactly.
 */
export function followPointer(container: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', container).map((layer) => ({
    depth: Number(layer.dataset.parallax),
    x: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3.out' }),
    y: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3.out' }),
  }));

  const glow = createGlow(container);

  function onMove(event: PointerEvent) {
    const box = container.getBoundingClientRect();
    // -1 to 1 from the centre of the container.
    const offsetX = ((event.clientX - box.left) / box.width) * 2 - 1;
    const offsetY = ((event.clientY - box.top) / box.height) * 2 - 1;

    for (const layer of layers) {
      layer.x(offsetX * layer.depth);
      layer.y(offsetY * layer.depth);
    }

    glow?.moveTo(event.clientX - box.left, event.clientY - box.top);
  }

  function onEnter() {
    glow?.show();
  }

  function onLeave() {
    for (const layer of layers) {
      layer.x(0);
      layer.y(0);
    }
    glow?.hide();
  }

  container.addEventListener('pointermove', onMove);
  container.addEventListener('pointerenter', onEnter);
  container.addEventListener('pointerleave', onLeave);

  return () => {
    container.removeEventListener('pointermove', onMove);
    container.removeEventListener('pointerenter', onEnter);
    container.removeEventListener('pointerleave', onLeave);
  };
}
