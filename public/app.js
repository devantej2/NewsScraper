function viewComments() {
  $(document).on("click", ".view-comments", function() {
    //Save the ID from that button
    let articleID = $(this).attr("data-id");

    console.log(articleID);

    //Send a GET request to the server
    $.ajax({
      method: "GET",
      url: "/unsaved-articles/" + articleID
    })
      //After the GET request goes through...
      .then(function(data) {
        for (let i = 0; i < data.length; i++) {
          //Empty all the existing comments in the Comments modal
          let article = data[i];
          $("#existing-comments").empty();

          //Fill in the title of the article at the top of the Comments modal
          $("#article-title").text(article.title);

          //Create a Post button in the Comments modal
          $("#post-button").html(
            `<button type="button" data-id="${article._id}"
              class="btn btn-primary post-comment" data-dismiss="modal">Post!</button>`
          );

          //If there's a comment associated with the article...
          if (article.comment) {
            //Go through each comment...
            article.comment.forEach(function(element) {
              //Add the comment's information to the comments section
              //Each comment is placed in a Div that has a class of the comment's ID, & a Delete button that also stores the comment's ID, so that the comment can be easily removed later on
              $("#existing-comments").prepend(
                "<div class = '" +
                  element._id +
                  "'><strong>" +
                  element.name +
                  ": </strong><a class='btn btn-info btn-sm delete-comment' data-id = '" +
                  element._id +
                  "' style='float: right'><span class='glyphicon glyphicon-remove'></span></a><br>" +
                  element.body +
                  "<br><hr><br></div>"
              );
            });
          }
        }
      });
  });
}

// Save an Article.
function saveArticle() {
  $(document).on("click", ".save-article", function() {
    event.preventDefault();
    let id = $(this).attr("data-id");
    console.log(id);

    $.ajax({
      url: "/unsaved-articles/" + id,
      type: "PUT",
      success: function() {
        $("#saveModal").modal("show");
      }
    }).then(function() {
      $(".saveModalCloseBtn").on("click", function() {
        window.location.href = "/unsaved-articles";
      });
    });
  });
}

//Sets up a function for viewing the comments on a particular article
//Whenever someone clicks a "View Comments" button...

//Sets up a function for posting a new comment
//Whenever someone clicks the "Post" button...
function postComment() {
  $(document).on("click", ".post-comment", function() {
    //Save the ID from that button
    var articleID = $(this).attr("data-id");

    //Send a POST request to the server
    $.ajax({
      method: "POST",
      url: "/post-comment/" + articleID,
      data: {
        //Value taken from the Name input
        name: $("#name").val(),
        // Value taken from Comment textarea
        body: $("#comment").val()
      }
    });

    //Remove the values entered currently typed into the form
    $("#name").val("");
    $("#comment").val("");
  });
}

//Sets up a function for deleting a comment
//Whenever someone clicks the "X" button next to a comment...
function deleteComment() {
  $(document).on("click", ".delete-comment", function() {
    //Save the ID from that button
    var articleID = $(this).attr("data-id");

    //Send a GET request to the server
    $.ajax({
      method: "GET",
      url: "/delete-comment/" + articleID
    })
      //Once the request is complete, delete the comment off the page
      .then(function(data) {
        $("." + articleID).remove();
      });
  });
}

function unSaveArticle() {
  $(".return-btn").on("click", function() {
    // Keep the page from reloading.
    event.preventDefault();
    // Read data attribute from "return" button.
    var id = $(this).data("id");

    // Send the PUT request.
    $.ajax({
      url: "/unsave/" + id,
      type: "PUT",
      success: function() {
        // Show the 'return' success message in the modal,
        $("#returnArticleModal").modal("show");
      }
    })
      // then update the page when the modal is closed.
      .then(function() {
        // console.log("Article removed");
        $(".returnArticleCloseBtn").on("click", function() {
          window.location.href = "/saved-articles";
        });
      });
  });
}

viewComments();
postComment();
deleteComment();
unSaveArticle();
saveArticle();
