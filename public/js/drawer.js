function toggleDrawer(drawerId) {
  const $targetEl = document.getElementById(drawerId);

  if (!$targetEl) {
    console.error('Drawer target element not found!');
  }

  const options = {
    placement: 'right',
    backdrop: true,
    bodyScrolling: false,
    edge: false,
    onHide: () => console.log('Drawer is hidden'),
    onShow: () => console.log('Drawer is shown'),
    onToggle: () => console.log('Drawer has been toggled')
  };

  const drawer = new Drawer($targetEl, options);
  drawer.toggle();
}

window.toggleDrawer = toggleDrawer;
