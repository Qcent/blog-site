async function upvoteClickHandler(event) {
    event.preventDefault();
    const id = event.target.getAttribute("data");
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id,
            positive: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert("You have already Voted on this Post!");
    }
}
async function downvoteClickHandler(event) {
    event.preventDefault();
    const id = event.target.getAttribute("data");
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id,
            positive: false
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert("You have already Voted on this Post!");
    }
}

//document.querySelector('.downvote-btn').addEventListener('click', downvoteClickHandler);
//document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);

Array.from(document.getElementsByClassName("downvote-btn")).forEach(function(element) {
    element.addEventListener('click', downvoteClickHandler);
});
Array.from(document.getElementsByClassName("upvote-btn")).forEach(function(element) {
    element.addEventListener('click', upvoteClickHandler);
});