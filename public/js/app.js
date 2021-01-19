
document.addEventListener("DOMContentLoaded", event => {

    // firebase init
    const db = firebase.firestore();
    const storage = firebase.storage();

    const form = document.querySelector("#submissionForm");

    // form fields
    const email = document.querySelector("#email");
    const file = document.querySelector("#file");
    const agreement = document.querySelector('#agreementCheck');
    const name = document.querySelector("#fullName");
    const division = document.querySelector("#division");
    const chapter = document.querySelector("#chapter");
    const workplace = document.querySelector("#workplace");
    const city = document.querySelector("#city");


    // form actions
    const imgPreview = document.querySelector("#preview");
    const progress = document.querySelector("#Progress");
    const progressBar = document.querySelector("#Progress-bar");
    const nextButton = document.querySelector("#next");
    const nextDiv = document.querySelector("#nextDiv");
    const submitButton = document.querySelector("#submit");
    const editButton = document.querySelector("#edit");
    const submitDiv = document.querySelector("#submitDiv");

    // form value init
    var emailValue;
    var nameValue;
    var divisionValue;
    var chapterValue;
    var workplaceValue;
    var imgUrl;
    var cityValue;

    pristine = new Pristine(form);

    pristine.addValidator(file, function () {
        if (file.files[0].size < 10000000) {
            return true;
        }
        return false;
    }, "File size must be bellow 10MB", 2, false);

    pristine.addValidator(agreement, function () {

        if (agreement.checked) {
            return true;
        }
        return false;
    }, "", 2, false);

    nextButton.addEventListener('click', function () {
        var valid = pristine.validate();
        if (valid) {
            toggleForm();
        }

    });

    editButton.addEventListener("click", function () {

        toggleForm();
    })

    submitButton.addEventListener("click", function () {

        progress.hidden = !progress.hidden;

        emailValue = email.value;
        nameValue = name.value;
        divisionValue = division.value;
        chapterValue = chapter.value;
        workplaceValue = workplace.value;
        cityValue = city.value;
        
        uploadFile();
    })

    function storeDetails() {

        db.collection("participants").doc(emailValue).set({
            email: emailValue,
            name: nameValue,
            division: divisionValue,
            chapter: chapterValue,
            workplace: workplaceValue,
            city: cityValue,
            url: imgUrl.toString(),
        })
            .then(function () {
                console.log("Document successfully written!");
                window.location.href = "success.html";
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            })
    }

    function uploadFile() {

        var task = storage.ref("arts/" + emailValue).put(file.files[0]);

        task.on('state_changed',

            function progess(snapshot) {
                var progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progressValue);
                progressBar.style.width = progressValue + '%';
            },
            function error(err) {
                console.log(err);
            },
            function completed() {
                console.log('file upload success');
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    imgUrl = downloadURL;
                    storeDetails();
                    
                });

            }

        );

    }

    // toggle between review and edit screen
    function toggleForm() {

        email.disabled = !email.disabled;
        name.disabled = !name.disabled;
        chapter.disabled = !chapter.disabled;
        workplace.disabled = !workplace.disabled;
        division.disabled = !division.disabled;
        file.disabled = !file.disabled;
        city.disabled =!city.disabled;

        nextDiv.hidden = !nextDiv.hidden;
        submitDiv.hidden = !submitDiv.hidden;

        if (file.files[0]) {
            imgPreview.src = URL.createObjectURL(file.files[0]);;

            imgPreview.onload = function () {
                URL.revokeObjectURL(imgPreview.src)
            }
        }

    }
})