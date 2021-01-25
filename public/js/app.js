
document.addEventListener("DOMContentLoaded", event => {

    // firebase init
    const db = firebase.firestore();
    const storage = firebase.storage();

    const detailsForm = document.querySelector("#detailsForm");
    const submissionForm = document.querySelector("#submissionForm");

    // form fields
    const email = document.querySelector("#email");
    const file = document.querySelectorAll(".file");
    const agreement = document.querySelector('#agreementCheck');
    const name = document.querySelector("#fullName");
    const division = document.querySelector("#division");
    const chapter = document.querySelector("#chapter");
    const workplace = document.querySelector("#workplace");
    const city = document.querySelector("#city");
    const theme = document.querySelector("#theme");
    const topic = document.querySelectorAll(".topic");
    const description = document.querySelectorAll(".description");


    // form actions
    const imgPreview = document.querySelectorAll(".preview");
    const progress = document.querySelectorAll(".progress");
    const progressBar = document.querySelectorAll(".progress-bar");
    const nextButton = document.querySelector("#next");
    const backButton = document.querySelector("#back");
    const submitButton = document.querySelector("#submit");


    // form value init
    var emailValue;
    var nameValue;
    var divisionValue;
    var chapterValue;
    var workplaceValue;
    var imgUrl;
    var cityValue;
    var themeValue;

    pristineDetails = new Pristine(detailsForm);
    pristineSubmission = new Pristine(submissionForm);

    // Custome validations

    /*##################
    file validations
    ###################*/
    pristineSubmission.addValidator(file[0], function () {
        if (file[0].files[0].size < 10000000) {
            return true;
        }
        return false;
    }, "File size must be bellow 10MB", 2, false);

    pristineSubmission.addValidator(file[0], function () {
        if (file[0].files[0].type.substring(0, 5) == 'image') {
            return true;
        }
        return false;
    }, "File must be an image type", 2, false);

    pristineSubmission.addValidator(file[1], function () {
        if(file[1].files[0]){
            if (file[1].files[0].size < 10000000) {
                return true;
            }
        }else{
            return true;
        }
        
        return false;
    }, "File size must be bellow 10MB", 2, false);

    pristineSubmission.addValidator(file[1], function () {
        if(file[1].files[0]){
            if (file[1].files[0].type.substring(0, 5) == 'image') {
                return true;
            }
        }else{
            return true;
        }
        
        return false;
    }, "File must be an image type", 2, false);

    pristineSubmission.addValidator(file[2], function () {
        if (file[2].files[0]){
            if (file[2].files[0].size < 10000000) {
                return true;
            }
        }else{
            return true;
        }
        
        return false;
    }, "File size must be bellow 10MB", 2, false);

    pristineSubmission.addValidator(file[2], function () {
        if (file[2].files[0]){
            if (file[2].files[0].type.substring(0, 5) == 'image') {
                return true;
            }
        }else{
            return true;
        }
        
        return false;
    }, "File must be an image type", 2, false);

    /*##################
    topics validations
    ###################*/
    pristineSubmission.addValidator(topic[1], function () {
        console.log("debug here");
        console.log(topic[1].value);
        if (file[1].files[0]){
            if (topic[1].value) {
                return true;
            }
        }else{
            return true;
        }
        
        return false;
    }, "This fiel is required", 2, false);

    pristineSubmission.addValidator(topic[2], function () {
        if (file[2].files[0]){
            if (topic[2].value) {
                return true;
            }
        }else{
            return true;
        }
        
        return false;
    }, "This fiel is required", 2, false);

    /*##################
    agreement validations
    ###################*/

    pristineSubmission.addValidator(agreement, function () {

        if (agreement.checked) {
            return true;
        }
        return false;
    }, "You must accept our terms and conditions", 2, false);


    // Button functions
    nextButton.addEventListener('click', function () {
        var valid = pristineDetails.validate();
        if (valid) {
            toggleDetailsForm();
        }

    });

    backButton.addEventListener('click', function () {
        toggleDetailsForm();

    });

    file[0].addEventListener('change', function () {
        console.log("image preview onChange fired");
        if (file[0].files[0]) {

            console.log(URL.createObjectURL(file[0].files[0]));
            imgPreview[0].src = URL.createObjectURL(file[0].files[0]);

            imgPreview[0].onload = function () {
                URL.revokeObjectURL(imgPreview[0].src)
            }
        }

    });

    file[1].addEventListener('change', function () {
        console.log("image preview onChange fired");
        if (file[1].files[0]) {

            console.log(URL.createObjectURL(file[1].files[0]));
            imgPreview[1].src = URL.createObjectURL(file[1].files[0]);

            imgPreview[1].onload = function () {
                URL.revokeObjectURL(imgPreview[1].src)
            }
        }

    });

    file[2].addEventListener('change', function () {
        console.log("image preview onChange fired");
        if (file[2].files[0]) {

            console.log(URL.createObjectURL(file[2].files[0]));
            imgPreview[2].src = URL.createObjectURL(file[2].files[0]);

            imgPreview[2].onload = function () {
                URL.revokeObjectURL(imgPreview[2].src)
            }
        }

    });

    submitButton.addEventListener("click", async function () {

        console.log("sumit button");

        emailValue = email.value;
        nameValue = name.value;
        divisionValue = division.value;
        chapterValue = chapter.value;
        workplaceValue = workplace.value;
        cityValue = city.value;
        themeValue = theme.value;

        var valid = pristineSubmission.validate();
        if (valid) {
            console.log("validation passed");
            progress[0].hidden = !progress[0].hidden;
            progress[1].hidden = !progress[1].hidden;
            progress[2].hidden = !progress[2].hidden;

            for(var i=0; i<3; i++){
                if (file[i].files[0]){
                    await uploadFile(file[i], progressBar[i],topic[i].value,description[i].value);
                    console.log(topic[i].value);
                    console.log(description[i].value);
                }
                
            }
            window.location.href = "success.html";
        }
    })

    function storeDetails(topicValue,descriptionValue) {
        return new Promise((resolve, _reject) => {
            db.collection("participants").doc(emailValue + Date.now()).set({
                email: emailValue,
                name: nameValue,
                division: divisionValue,
                chapter: chapterValue,
                workplace: workplaceValue,
                city: cityValue,
                topic: topicValue,
                theme: themeValue,
                description: descriptionValue,
                url: imgUrl.toString(),
            })
                .then(function () {
                    console.log("Document successfully written!");
                    resolve("success");         
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                    resolve("Error");
                })
        });
    }

    function uploadFile(file, progressBar,topic,description) {
        return new Promise((resolve, _reject) => {
            var task = storage.ref("arts/" + emailValue + Date.now()).put(file.files[0]);

            task.on('state_changed',

                function progess(snapshot) {
                    var progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progressValue);
                    progressBar.style.width = progressValue + '%';
                },
                function error(err) {
                    console.log(err);
                    resolve("Error");
                },
                function completed() {
                    console.log('file upload success');
                    task.snapshot.ref.getDownloadURL().then(async function (downloadURL) {
                        imgUrl = downloadURL;
                        await storeDetails(topic,description);
                        resolve("Completed");
                    });
                    
                }

            );
        });
    }

    // toggle between review and edit screen
    function toggleDetailsForm() {

        submissionForm.hidden = !submissionForm.hidden;
        detailsForm.hidden = !detailsForm.hidden;

    }
})