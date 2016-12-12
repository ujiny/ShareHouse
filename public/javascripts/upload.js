$("#photo-update-action-selector").click(function() {
      $("#photo-update-action-selector").children(".select-items").toggle();
  });

$("#upload-new-photo").click(function() {
    $("#photo-upload-error-box").html("");
    $("#uploadnewphoto").click();
});

$("#remove-photo").click(function() {

});

$("#uploadnewphoto").change(function() {
  console.log("Change!!");
  var file = this.files[0];

  if (checkUploadFile(file, 700) == true) {
      var formData = new FormData($('#frmOffice')[0]);
      //- formData.append('file', $("#uploadnewphoto")[0].files[0]);

      $.ajax({
          url: "/posts/info/upload-new-photo",
          type: "POST",
          processData: false,
          contentType: false,
          data: formData,
          success: function(result) {
              if (result.code == "0000") {
                  alert('success');
                  console.log("Success");
                  //- location.href = "/home#{logintype}";
              } else {
                  $("#photo-upload-error-box").html(result.message);
              }
          },
          error: function(req, status, err) {
              //- alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
              $("#errormsg").html("code:"+status+"\n"+"message:"+req.responseText+"\n"+"error:"+err);
          }
    }); //ajax
  }
});
