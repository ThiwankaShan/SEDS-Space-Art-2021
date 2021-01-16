
document.addEventListener("DOMContentLoaded", event => {

    // firebase init
    const app = firebase.app();
    const db = firebase.firestore();
    const storage = firebase.storage();

    const form = document.querySelector("submissionForm");

    // form fields
    const email = document.querySelector("#email");
    const file = document.querySelector("#file");

    // form actions
    const imgPreview = document.querySelector("#preview");
    const progress = document.querySelector("#Progress");
    const progressBar = document.querySelector("#Progress-bar");
    const nextButton = document.querySelector("#next");
    const submitButton = document.querySelector("#submit");
    const editButton = document.querySelector("#edit");

    // form value init
    var emailValue;
    var fileValue;
    var imgUrl;

    form.validate({
        rules:{
            email:{
                required:true,
                email:true,
            }
        }
    })

    nextButton.addEventListener("click", function () {

        if(form.valid()){
            console.log('form valid');
        }else{
            console.log('form invalid');
        }
        
    })


    /*
    nextButton.addEventListener("click", function () {

        emailValue = email.value;
        fileValue = file.files[0];
        toggleForm();

    })
    */
    editButton.addEventListener("click", function () {

        toggleForm();
    })

    submitButton.addEventListener("click", function () {

        progress.hidden = !progress.hidden;

        uploadFile();
    })

    function storeDetails() {

        db.collection("participants").doc(emailValue).set({
            email: emailValue,
            url: imgUrl.toString(),
        })
            .then(function () {
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            })
    }

    function uploadFile() {

        var task = storage.ref("arts/" + emailValue).put(fileValue);

        task.on('state_changed',

            function progess(snapshot) {

                var progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.style.width = progressValue + '%';
            },
            function error(err) {
                console.log(err);
            },
            function completed() {
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    imgUrl = downloadURL;
                    storeDetails();
                    window.location.href = "success.html";
                });
                
            }

        );

    }

    // toggle between review and edit screen
    function toggleForm() {

        email.disabled = !email.disabled;
        file.disabled = !file.disabled;

        nextButton.hidden = !nextButton.hidden;
        submitButton.hidden = !submitButton.hidden;
        editButton.hidden = !editButton.hidden;

        if (file.files[0]) {
            imgPreview.src = URL.createObjectURL(file.files[0]);;

            imgPreview.onload = function () {
                URL.revokeObjectURL(imgPreview.src)
            }
        }

    }
})