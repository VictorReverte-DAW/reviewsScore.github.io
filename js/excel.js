function DisplayTotalReviews(fileName) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "./excel/" + fileName + ".csv",
    "method": "GET",
    xhr:function(){// Seems like the only way to get access to the xhr object
      var xhr = new XMLHttpRequest();
      xhr.responseType= 'blob'
      return xhr;
    }
  };

  $.ajax(settings).done(function (response) {
    let file = response;
    let reader = new FileReader();
    //For Browsers other than IE.
    if (reader.readAsBinaryString) {
      reader.onload = function (e) {
        ProcessExcel(e.target.result, fileName);
      };
      reader.readAsBinaryString(file);
    } else {
      //For IE Browser.
      reader.onload = function (e) {
        let data = "";
        let bytes = new Uint8Array(e.target.result);
        for (let i = 0; i < bytes.byteLength; i++) {
          data += String.fromCharCode(bytes[i]);
        }
        ProcessExcel(data, fileName);
      };
      reader.readAsArrayBuffer(file);
    }
  })
}

function ProcessExcel(data, name) {
  //Read the Excel File data.
  let reviews = { cantPositive: 0, cantNegative: 0 };

  let workbook = XLSX.read(data, {
    type: 'binary'
  });

  //Fetch the name of First Sheet.
  let firstSheet = workbook.SheetNames[0];

  //Read all rows from First Sheet into an JSON array.
  let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);


  let table = $('#reviews-table');

  if(name=="tripadvisor"){
    table.append('<tr id=' + name + '><td>TripAdvisor</td></tr>')
  }else{
    table.append('<tr id=' + name + '><td>' + name.charAt(0).toUpperCase() + name.slice(1) + '</td></tr>')
  }



  //Add the data rows from Excel file.
  for (const element of excelRows) {
    if(name=="tripadvisor" || name=="google"){
      if (element.review_rating > 3) {
        reviews.cantPositive += 1;
      } else {
        reviews.cantNegative += 1;
      }
    }

    if(name=="booking"){
      if (element.review_rating >=7) {
        reviews.cantPositive += 1;
      }else{
        reviews.cantNegative += 1;
      }
      
     /* if(element.review_rating<=5)  {
        reviews.cantNegative += 1;
      }*/
    }
    
  }

  let total = reviews.cantPositive + reviews.cantNegative;
  let score1 = parseFloat((reviews.cantPositive - reviews.cantNegative) /total).toFixed(2);
  let score2 = parseFloat((reviews.cantPositive / total) * 100).toFixed(2);
  $('#' + name).append('<td class="positive">' + reviews.cantPositive + '</td><td class="negative">' + reviews.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")

};

let showReviewsScore = (fileName) =>{
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "./excel/" + fileName + ".csv",
    "method": "GET",
    xhr:function(){// Seems like the only way to get access to the xhr object
      var xhr = new XMLHttpRequest();
      xhr.responseType= 'blob'
      return xhr;
    }
  };

  $.ajax(settings).done(function (response) {
    let file = response;
    let reader = new FileReader();
    //For Browsers other than IE.
    if (reader.readAsBinaryString) {
      reader.onload = function (e) {
        getReviewsCategory(e.target.result, fileName);
      };
      reader.readAsBinaryString(file);
    } else {
      //For IE Browser.
      reader.onload = function (e) {
        let data = "";
        let bytes = new Uint8Array(e.target.result);
        for (let i = 0; i < bytes.byteLength; i++) {
          data += String.fromCharCode(bytes[i]);
        }
        getReviewsCategory(data, fileName);
      };
      reader.readAsArrayBuffer(file);
    }
  })
}

function getReviewsCategory(data, name) {
  //Read the Excel File data.
  let reviews_category = [{ Rooms:{cantPositive: 0,cantNegative:0},
                           FoodBeverage:{cantPositive: 0,cantNegative:0}, 
                           StaffService:{cantPositive: 0,cantNegative:0}, 
                           OtherFacilities:{cantPositive: 0,cantNegative:0}, 
                           Location:{cantPositive: 0,cantNegative:0}, 
                           Design:{cantPositive: 0,cantNegative:0},
                           PriceValueForMoney:{cantPositive: 0,cantNegative:0},
                           OverallExperience:{cantPositive: 0,cantNegative:0},
                        }];

  let workbook = XLSX.read(data, {
    type: 'binary'
  });

  //Fetch the name of First Sheet.
  let firstSheet = workbook.SheetNames[0];

  //Read all rows from First Sheet into an JSON array.
  let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);


  let table = $('#reviews-table-category');

  $('#reviews-table-category tbody').empty();

  if(name=="tripadvisor"){
    $('#reviews-table-category caption').text('TripAdvisor');
  }else{
    $('#reviews-table-category caption').text(name.charAt(0).toUpperCase() + name.slice(1));
  }



  //Add the data rows from Excel file.
  for (const element of excelRows) {
     if(element.Rooms != undefined && element.Rooms != ""){
      
        if(element.Rooms.toLowerCase() == "p"){
          console.log(reviews_category)
          reviews_category[0].Rooms.cantPositive += 1;
        }else{
          reviews_category[0].Rooms.cantNegative += 1;
        }
     }
     if(element.FoodBeverage != undefined && element.FoodBeverage != ""){
        if(element.FoodBeverage.toLowerCase() == "p"){
          reviews_category[0].FoodBeverage.cantPositive += 1;
        }else{
          reviews_category[0].FoodBeverage.cantNegative += 1;
        }
     }
     if(element.StaffService != undefined && element.StaffService != ""){
        if(element.StaffService.toLowerCase() == "p"){
          reviews_category[0].StaffService.cantPositive += 1;
        }else{
          reviews_category[0].StaffService.cantNegative += 1;
        }
     }
     if(element.Location != undefined && element.Location != ""){
        if(element.Location.toLowerCase() == "p"){
          reviews_category[0].Location.cantPositive += 1;
        }else{
          reviews_category[0].Location.cantNegative += 1;
        }
     }
     if(element.Design != undefined && element.Design != ""){
        if(element.Design.toLowerCase() == "p"){
          reviews_category[0].Design.cantPositive += 1;
        }else{
          reviews_category[0].Design.cantNegative += 1;
        }
     }
     if(element.PriceValueForMoney != undefined && element.PriceValueForMoney != ""){
        if(element.PriceValueForMoney.toLowerCase() == "p"){
          reviews_category[0].PriceValueForMoney.cantPositive += 1;
        }else{
          reviews_category[0].PriceValueForMoney.cantNegative += 1;
        }
     }
     if(element.OverallExperience != undefined && element.OverallExperience != ""){
        if(element.OverallExperience.toLowerCase() == "p"){
          reviews_category[0].OverallExperience.cantPositive += 1;
        }else{
          reviews_category[0].OverallExperience.cantNegative += 1;
        }
     }
     if(element.Otherfacilities != undefined && element.Otherfacilities != ""){
        if(element.Otherfacilities.toLowerCase() == "p"){
          reviews_category[0].OtherFacilities.cantPositive += 1;
        }else{
          reviews_category[0].OtherFacilities.cantNegative += 1;
        }
     }
  }
  reviews_category.forEach(review => {

    console.log(review)
    if(review.Rooms.cantPositive != 0 || review.Rooms.cantNegative != 0){
      table.append('<tr id="rooms_review"><td>Rooms</td></tr>')
      let total = review.Rooms.cantPositive + review.Rooms.cantNegative;
      let score1 = parseFloat((review.Rooms.cantPositive - review.Rooms.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.Rooms.cantPositive / total) * 100).toFixed(2);
      $("#rooms_review").append('<td class="positive">' + review.Rooms.cantPositive + '</td><td class="negative">' + review.Rooms.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>");
    }

    if(review.FoodBeverage.cantPositive != 0 || review.FoodBeverage.cantNegative != 0){
      table.append('<tr id="FoodBeverage_review"><td>Food & Beverage</td></tr>')
      let total = review.FoodBeverage.cantPositive + review.FoodBeverage.cantNegative;
      let score1 = parseFloat((review.FoodBeverage.cantPositive - review.FoodBeverage.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.FoodBeverage.cantPositive / total) * 100).toFixed(2);
      $('#FoodBeverage_review').append('<td class="positive">' + review.FoodBeverage.cantPositive + '</td><td class="negative">' + review.FoodBeverage.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }

    if(review.StaffService.cantPositive != 0 || review.StaffService.cantNegative != 0){
      table.append('<tr id="staffService_review"><td>Staff & Service</td></tr>')
      let total = review.StaffService.cantPositive + review.StaffService.cantNegative;
      let score1 = parseFloat((review.StaffService.cantPositive - review.StaffService.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.StaffService.cantPositive / total) * 100).toFixed(2);
      $("#staffService_review").append('<td class="positive">' + review.StaffService.cantPositive + '</td><td class="negative">' + review.StaffService.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }
    
     if(review.OtherFacilities.cantPositive != 0 || review.OtherFacilities.cantNegative != 0){
      table.append('<tr id="otherFacilities_review"><td>Other facilities</td></tr>')
      let total = review.OtherFacilities.cantPositive + review.OtherFacilities.cantNegative;
      let score1 = parseFloat((review.OtherFacilities.cantPositive - review.OtherFacilities.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.OtherFacilities.cantPositive / total) * 100).toFixed(2);
      $("#otherFacilities_review").append('<td class="positive">' + review.OtherFacilities.cantPositive + '</td><td class="negative">' + review.OtherFacilities.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }

    if(review.Location.cantPositive != 0 || review.Location.cantNegative != 0){
      table.append('<tr id="location_review"><td>Location</td></tr>')
      let total = review.Location.cantPositive + review.Location.cantNegative;
      let score1 = parseFloat((review.Location.cantPositive - review.Location.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.Location.cantPositive / total) * 100).toFixed(2);
      $("#location_review").append('<td class="positive">' + review.Location.cantPositive + '</td><td class="negative">' + review.Location.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }

    if(review.Design.cantPositive != 0 || review.Design.cantNegative != 0){
      table.append('<tr id="design_review"><td>Design</td></tr>')
      let total = review.Design.cantPositive + review.Design.cantNegative;
      let score1 = parseFloat((review.Design.cantPositive - review.Design.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.Design.cantPositive / total) * 100).toFixed(2);
      $("#design_review").append('<td class="positive">' + review.Design.cantPositive + '</td><td class="negative">' + review.Design.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }

    if(review.PriceValueForMoney.cantPositive != 0 || review.PriceValueForMoney.cantNegative != 0){
      table.append('<tr id="priceValue_review"><td>Price/Value for money</td></tr>')
      let total = review.PriceValueForMoney.cantPositive + review.PriceValueForMoney.cantNegative;
      let score1 = parseFloat((review.PriceValueForMoney.cantPositive - review.PriceValueForMoney.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.PriceValueForMoney.cantPositive / total) * 100).toFixed(2);
      $("#priceValue_review").append('<td class="positive">' + review.PriceValueForMoney.cantPositive + '</td><td class="negative">' + review.PriceValueForMoney.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }

    if(review.OverallExperience.cantPositive != 0 || review.OverallExperience.cantNegative != 0){
      table.append('<tr id="overallExperience_review"><td>Overall experience</td></tr>')
      let total = review.OverallExperience.cantPositive + review.OverallExperience.cantNegative;
      let score1 = parseFloat((review.OverallExperience.cantPositive - review.OverallExperience.cantNegative) /total).toFixed(2);
      let score2 = parseFloat((review.OverallExperience.cantPositive / total) * 100).toFixed(2);
      $("#overallExperience_review").append('<td class="positive">' + review.OverallExperience.cantPositive + '</td><td class="negative">' + review.OverallExperience.cantNegative + '</td>'+"<td>"+"<div class='w3-border' style='background-color:red'><div style='height:24px;width:"+score2+"%;background-color: green'>"+score2+"%</div></div></td>"+"<td class='score1'>" + score1 + "</td>" + "<td class='score2'>" + score2 + "%</td>")
    }
   

  });
  
  $('#table-reviews-category-container').show();
};

