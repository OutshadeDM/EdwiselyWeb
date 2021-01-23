$(document).ready(function () {
  // Hide submenus
  $('#body-row .collapse').collapse('hide'); 

  // Collapse/Expand icon
  $('#collapse-icon').addClass('fa-angle-double-left'); 

  // Collapse click
  $('[data-toggle=sidebar-colapse]').click(function() {
      SidebarCollapse();
  });

  function SidebarCollapse () {
      $('#sidebar-container').toggleClass("shrink");
      $(".right-div").toggleClass("shrink");
      $('.menu-collapsed').toggleClass('d-none');
      $('.sidebar-submenu').toggleClass('d-none');
      $('.submenu-icon').toggleClass('d-none');
      $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
      if($('#logoImage').attr('src') == '../images/Org_White.svg'){
        $('#logoImage').attr('src','https://space.edwisely.com/content/images/size/w100/2020/07/webpage_200x200-2.png');
        $('#logoImage').attr('width','60');
        $('#logoImage').attr('height','45');
      }
      else{
        $('#logoImage').attr('src','../images/Org_White.svg');
        $('#logoImage').attr('width','200');
        $('#logoImage').attr('height','75');
      }
    
    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
  }
});