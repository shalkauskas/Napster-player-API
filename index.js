// //jshint esversion:6

$(document).ready(function(){

  let popup = () => {
     if ($('img').hasClass('onclick')) {
       setTimeout(function() {
         alert('You have no permission to do this!');
       }, 200);
     }};



  $('img').on('click', function(){
    $(this).addClass('onclick');
let iconClass = this.id;
let icons = ['my-computer', 'bin', 'internet-explorer'];
let matchCheck = icons.find(x => x == iconClass);
console.log(matchCheck);
  if (iconClass == matchCheck){
    popup();
    setTimeout(function() {
           $('img').removeClass('onclick');
         }, 600);
  } else {
    setTimeout(function() {
           $('img').removeClass('onclick');
         }, 200);
  }
});




});
















// $(document).ready(function() {
//   // Adds 'clicked on' effect to the icon
//   $('img').on('click', function() {
//     $(this).addClass('onclick');
//     popup();
//
//   });
//   // Alert window and remove effect
//   let popup = () => {
//     if ($('img').hasClass('onclick')) {
//       setTimeout(function() {
//         alert('You have no permission to do this!');
//       }, 200);
//       setTimeout(function() {
//         $('img').removeClass('onclick');
//       }, 600);
//     }
//   };
//
// });
