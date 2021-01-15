
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    const db = firebase.firestore();
    const storage = firebase.storage();

    const email = document.querySelector("#email");
    const file = document.querySelector("#file");
    const imgPreview = document.querySelector("#preview");
    const nextButton = document.querySelector("#next");
    const submitButton = document.querySelector("#submit");
    const editButton = document.querySelector("#edit");

    var emailValue;
    var fileValue;

    nextButton.addEventListener("click", function () {

        emailValue = email.value;
        fileValue = file.files[0];
        console.log(fileValue);

        nextButton.style.display = "none";
        submitButton.style.display = "inline-block";
        editButton.style.display = "inline-block";

        toggleForm();

    })

    editButton.addEventListener("click", function () {

        nextButton.style.display = "inline-block";
        submitButton.style.display = "none";
        editButton.style.display = "none";

        toggleForm();

    })

    submitButton.addEventListener("click", function () {

        var task = storage.ref("arts/" + emailValue).put(fileValue);

        task.on('state_changed',

            function progess(snapshot) {

                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            },
            function error(err) {
                console.log(err);
            },
            function completed() {
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                });
            }

        );

        db.collection("participants").doc(emailValue).set({
            Email: emailValue,
        })
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            })
    })

    function toggleForm() {
        email.disabled = !email.disabled;
        file.disabled = !file.disabled;

        if (file.files[0]) {
            imgPreview.src =  URL.createObjectURL(file.files[0]);;

            imgPreview.onload = function() {
                URL.revokeObjectURL(imgPreview.src) 
              }
        }

    }
})