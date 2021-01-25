


$(document).ready(async function () {

    // firebase init
    const auth = firebase.auth();
    const db = firebase.firestore();

    /*
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    */

    const email = 'admin@gmail.com';
    const password = 'spaceart#97';
    var user;
    var dataSet = new Array();
    var id = 1;
    await auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in

            user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });

    if (user) {

        await db.collection("participants").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                dataSet.push([
                    id,
                    doc.data().theme,
                    doc.data().topic,
                    doc.data().description,
                    doc.data().url,
                    doc,
                ]);
                id++
            });
        });

    }



    $('#datatable').DataTable({
        data: dataSet,
        "columns": [
            { title: "id" },
            {
                title: "theme",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if(oData[1]==1){
                        var theme = "First Contact";
                    }else if(oData[1]==1){
                        var theme = "The next stop"
                    }else{
                        var theme = "Cosmos 2022"
                    }   
                    $(nTd).html("<p>"+theme+"</p>");
                }
            },
            { title: "topic" },
            { title: "description" },
            {
                title: "url",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='" + oData[4] + "' id='" + oData[3] + "'> link </a>");
                }
            },
            {
                title: "score",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if (oData[5].data().score) {
                        $(nTd).html("<p id='" + oData[5].id + "'>" + oData[5].data().score + "</p>");
                    } else {
                        $(nTd).html("<div class='input-group'> <input type='number' id='" + oData[5].id + "value' class='form-control' placeholder='Score'><span class='input-group-btn'><button class='btn btn-default' id='" + oData[5].id + "'>Add</button></span></div>");
                    }

                }
            },
        ]
    });

    $(".btn").click(async function (event) {

        var docid = $(this).attr('id');
        var input = document.getElementById(docid + "value").value;
        var docref = db.collection("participants").doc(docid);

        await docref.update({
            score: input,
        })
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    });

});



