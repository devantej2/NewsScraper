//View the comments on a particular article
function viewComments() {
  $(document).on("click", ".view-comments", function() {
    let id = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "/articles/" + id
    }).then(function(data) {
      $("#existing-comments").empty();
      $("#article-title").text(data.title);

      //Create a Post button in the Comments modal
      $("#post-button").html(`<button type="button" data-id="${data._id}"
class="btn btn-primary post-comment" data-dismiss="modal">Post!</button>`);

      //If there's a comment associated with the article, iterate through and create the comments to display in the modal
      if (data.comment) {
        data.comment.forEach(element => {
          $("#existing-comments").prepend(
            `<div class="${element._id}">
                <h5>${element.name}:</h5> 
                <a class='btn btn-info delete-comment' data-id="${element._id}">Delete</a>
                ${element.body}
                </div>`
          );
        });
      }
    });
  });
}

//Posting a new comment
function postComment() {
  $(document).on("click", ".post-comment", function() {
    let id = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + id,
      data: {
        name: $("#name").val(),
        body: $("#comment").val()
      }
    });

    $("#name").val("");
    $("#comment").val("");
  });
}

//Deleting comments
function deleteComment() {
  $(document).on("click", ".delete-comment", function() {
    let id = $(this).attr("data-id");

    $.ajax({
      method: "GET",
      url: "/articles/" + id
    }).then(function(data) {
      $("." + thisId).remove();
    });
  });
}

//Save an article
function saveArticle() {
  $(".save-article").on("click", function() {
    let id = $(this).attr("data-id");

    $.ajax({
      url: "/articles/" + id,
      type: "PUT",
      success: function() {
        $("#saveArticleModal").modal("show");
      }
    }).then(function() {
      $(".saveArticleCloseBtn").on("click", function() {
        window.location.href = "/articles";
      });
    });
  });
}

//Remove article from saved list
function removeArticle() {
  $(".remove-article").on("click", function() {
    let id = $(this).attr("data-id");

    $.ajax({
      url: "/saved/" + id,
      type: "PUT",
      success: function() {
        $("#returnArticleModal").modal("show");
      }
    }).then(function() {
      $(".returnArticleCloseBtn").on("click", function() {
        window.location.href = "/saved";
      });
    });
  });
}

//Calling functions
viewComments();
postComment();
deleteComment();
removeArticle();
saveArticle();
