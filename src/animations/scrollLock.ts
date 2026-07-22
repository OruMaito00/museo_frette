const preventScroll = (e: Event): void => {
  e.preventDefault();
};

const preventArrowScroll = (e: KeyboardEvent): void => {
  const keys = [
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    ' ',
  ];
  if (keys.includes(e.key)) e.preventDefault();
};

export const lockUserScroll = (): void => {
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventArrowScroll, false);
};

export const unlockUserScroll = (): void => {
  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
  window.removeEventListener('keydown', preventArrowScroll);
};
