const stickybits = require('stickybits');

/*
  Sticky Sidebar
*/
let sb = stickybits('aside');
let sbActive = true;

window.addEventListener('resize', handleStickySidebar);
handleStickySidebar();

function handleStickySidebar() {
  const sbBreakpoint = parseInt(getComputedStyle(document.body).getPropertyValue('--bp-medium'));

  if (window.innerWidth <= sbBreakpoint && sbActive) {
    sb.cleanup();
    sbActive = false;
  } else if (window.innerWidth > sbBreakpoint && !sbActive) {
    sb = stickybits('aside');
    sbActive = true;
  }
}
