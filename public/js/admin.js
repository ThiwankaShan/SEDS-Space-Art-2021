$(document).ready(async function () {

    const db = firebase.firestore();
    var dataSet = [];
    

    exportToCsv = async function () {

        await db.collection("participants").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                dataSet.push([
                    doc.data().email,
                    doc.data().theme,
                    doc.data().topic,
                    doc.data().description,
                    doc.data().url,
                ]);
            });
        });

        var CsvString = "";
        dataSet.forEach(function (RowItem, RowIndex) {
            RowItem.forEach(function (ColItem, ColIndex) {
                CsvString += ColItem + ',';
            });
            CsvString += "\r\n";
        });
        CsvString = "data:application/csv," + encodeURIComponent(CsvString);
        var x = document.createElement("A");
        x.setAttribute("href", CsvString);
        x.setAttribute("download", "submissions.csv");
        document.body.appendChild(x);
        x.click();
    }


   

});



