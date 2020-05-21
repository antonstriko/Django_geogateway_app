
// listener for TOOL PANEL TABS
// $(document).ready(function() {
//     $(".tab-button").click(function() {
//         if($(this).hasClass('tool-tab-button'))
//         {
// 	    $(this).parent().parent().children().removeClass('active');
// 	    $(this).parent().addClass('active');
// 	    updateTabPanel();
// 	}
//
//     });

import Vue from 'vue'
import { BSidebar } from 'bootstrap-vue'

Vue.component('b-sidebar', BSidebar)


var example1 = new Vue({
  el: '#example-1',
    delimiters: ['[[', ']]'],
  data: {
    counter: 0
  }
})

    //	$('.extra-tools-panel').draggable();
// });

// function updateTabPanel() {
//     var active_tab = $('.tool-tabs').children('.active').children().val();
//     $('.tools-panel').children('.active').removeClass('active').addClass('inactive');
//     $('.tools-panel').children('#' + active_tab).removeClass('inactive').addClass('active');
// };
