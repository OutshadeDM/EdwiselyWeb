$(document).ready(function () {

    // Hide submenus
  $('#body-row .collapse').collapse('hide'); 

  // Collapse/Expand icon
  $('#collapse-icon').addClass('fa-angle-double-left'); 

  // Collapse click
  $('[data-toggle=sidebar-collapse]').click(function() {
      SidebarCollapse();
  });

  function SidebarCollapse () {
      $('.menu-collapsed').toggleClass('d-none');
      $('.sidebar-submenu').toggleClass('d-none');
      $('.submenu-icon').toggleClass('d-none');
      $('#sidebarChange').toggleClass('col-lg-2 col-lg-1');
      $('#mainContentSwitch').toggleClass('col-lg-10 col-lg-11');
      $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
      if($('#logoImage').attr('src') == 'https://www.edwisely.com/assets/images/common/logo.svg'){
        $('#logoImage').attr('src','https://space.edwisely.com/content/images/size/w100/2020/07/webpage_200x200-2.png');
        $('#logoImage').attr('width','60');
        $('#logoImage').attr('height','60');
        $('#theMainDiv').css('padding-left','10%');
        $('#theMainDiv').css('padding-right','8%');
      }
      else{
        $('#logoImage').attr('src','https://www.edwisely.com/assets/images/common/logo.svg');
        $('#logoImage').attr('width','200');
        $('#logoImage').attr('height','75');
        $('#theMainDiv').css('padding-left','6%');
        $('#theMainDiv').css('padding-right','10%');
      }
      
      // Treating d-flex/d-none on separators with title
      var SeparatorTitle = $('.sidebar-separator-title');
      if ( SeparatorTitle.hasClass('d-flex') ) {
          SeparatorTitle.removeClass('d-flex');
      } else {
          SeparatorTitle.addClass('d-flex');
      }
      
      // Collapse/Expand icon
      $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
  }

});