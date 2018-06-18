$.getJSON("/articles", function(result) {
    for (var i = 0; i < result.length; i++) {
      $("#articles").append("<p result-id='" + result[i]._id + "'>" + result[i].title + "<br />" + result[i].link + "</p>");
    }
  });
  
  $(document).on("click", "p", function() {
    $("#comments").empty();
    var thisId = $(this).attr("result-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(result) {
        console.log(result);
        $("#comments").append("<h2>" + result.title + "</h2>");
        $("#comments").append("<input id='titleinput' name='title' >");
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#comments").append("<button result-id='" + result._id + "' id='savecomment'>Save Comment</button>");
  
        if (result.note) {
          $("#titleinput").val(result.note.title);
          $("#bodyinput").val(result.note.body);
        }
      });
  });
  
  $(document).on("click", "#savecomment", function() {
    var thisId = $(this).attr("result-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      result: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(result) {
        console.log(result);
        $("#comments").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  